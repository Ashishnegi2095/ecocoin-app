-- EcoCoin MVP schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'EcoCoin User',
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  machine_code text unique not null,
  name text not null,
  location text not null default 'Demo location',
  status text not null default 'available' check (status in ('available','unavailable','maintenance')),
  demo_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reward_rates (
  material text primary key check (material in ('PET','FILM')),
  coins_per_kg numeric(10,2) not null check (coins_per_kg >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  total_weight_kg numeric(12,3) not null default 0,
  total_deposits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  machine_id uuid not null references public.machines(id),
  material text not null check (material in ('PET','FILM')),
  weight_kg numeric(10,3) not null check (weight_kg > 0),
  item_count integer not null check (item_count > 0),
  coins_awarded bigint not null check (coins_awarded >= 0),
  status text not null default 'verified' check (status in ('pending','verified','rejected')),
  source text not null default 'simulation' check (source in ('simulation','hardware')),
  idempotency_key uuid unique not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  deposit_id uuid references public.deposits(id),
  redemption_id uuid,
  type text not null check (type in ('deposit_reward','redemption','adjustment')),
  amount bigint not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  cost_coins bigint not null check (cost_coins > 0),
  active boolean not null default true,
  stock integer,
  created_at timestamptz not null default now()
);

create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  reward_id uuid not null references public.rewards(id),
  coins_spent bigint not null,
  redemption_code text unique not null,
  status text not null default 'issued',
  created_at timestamptz not null default now()
);
alter table public.coin_transactions add constraint coin_transactions_redemption_fk
  foreign key (redemption_id) references public.redemptions(id) on delete set null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Automatically create profile and wallet for every new account.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','EcoCoin User'), new.email)
  on conflict (id) do nothing;
  insert into public.wallets(user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.reward_rates(material, coins_per_kg) values ('PET',10),('FILM',5)
on conflict (material) do nothing;

insert into public.machines(machine_code,name,location,demo_enabled)
values ('ECO-MATHURA-001','EcoCoin Demo Machine','Mathura, Uttar Pradesh',true)
on conflict (machine_code) do nothing;

insert into public.rewards(name,description,cost_coins,stock) values
('₹10 Discount Coupon','Prototype coupon; partner validation required.',100,100),
('₹50 Discount Coupon','Prototype coupon; partner validation required.',450,50),
('Reusable Eco Bag','Reusable shopping bag.',300,25),
('Plant Sapling','A sapling for a greener community.',250,25)
on conflict do nothing;

-- Only authenticated users can create deposits through this explicitly demo-only RPC.
create or replace function public.simulate_deposit(
  p_machine_code text, p_material text, p_weight_kg numeric, p_item_count integer
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_machine public.machines%rowtype;
  v_rate numeric;
  v_coins bigint;
  v_deposit public.deposits%rowtype;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_material not in ('PET','FILM') then raise exception 'Unsupported material'; end if;
  if p_weight_kg is null or p_weight_kg <= 0 or p_weight_kg > 20 then raise exception 'Weight must be between 0 and 20 kg'; end if;
  if p_item_count is null or p_item_count < 1 or p_item_count > 500 then raise exception 'Invalid item count'; end if;

  select * into v_machine from public.machines
  where machine_code = p_machine_code and demo_enabled = true and status = 'available';
  if not found then raise exception 'Demo machine not found or unavailable'; end if;

  select coins_per_kg into v_rate from public.reward_rates where material = p_material;
  if v_rate is null then raise exception 'Reward rate not configured'; end if;
  v_coins := floor(p_weight_kg * v_rate);

  insert into public.deposits(user_id,machine_id,material,weight_kg,item_count,coins_awarded,source)
  values (v_user,v_machine.id,p_material,p_weight_kg,p_item_count,v_coins,'simulation')
  returning * into v_deposit;

  update public.wallets set balance = balance + v_coins,
    total_weight_kg = total_weight_kg + p_weight_kg,
    total_deposits = total_deposits + 1, updated_at = now()
  where user_id = v_user;

  insert into public.coin_transactions(user_id,deposit_id,type,amount,description)
  values (v_user,v_deposit.id,'deposit_reward',v_coins,
    p_material || ' simulated deposit: ' || p_weight_kg || ' kg');

  return jsonb_build_object('deposit_id',v_deposit.id,'coins_awarded',v_coins,
    'weight_kg',p_weight_kg,'material',p_material,'source','simulation');
end; $$;

create or replace function public.redeem_reward(p_reward_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_reward public.rewards%rowtype;
  v_code text := upper(substr(encode(gen_random_bytes(8),'hex'),1,12));
  v_redemption public.redemptions%rowtype;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select * into v_reward from public.rewards where id = p_reward_id and active = true for update;
  if not found then raise exception 'Reward is unavailable'; end if;
  if v_reward.stock is not null and v_reward.stock <= 0 then raise exception 'Reward is out of stock'; end if;

  update public.wallets set balance = balance - v_reward.cost_coins, updated_at = now()
  where user_id = v_user and balance >= v_reward.cost_coins;
  if not found then raise exception 'Insufficient EcoCoins'; end if;

  insert into public.redemptions(user_id,reward_id,coins_spent,redemption_code)
  values (v_user,v_reward.id,v_reward.cost_coins,v_code) returning * into v_redemption;

  if v_reward.stock is not null then update public.rewards set stock = stock - 1 where id = v_reward.id; end if;
  insert into public.coin_transactions(user_id,redemption_id,type,amount,description)
  values (v_user,v_redemption.id,'redemption',-v_reward.cost_coins,'Redeemed: ' || v_reward.name);

  return jsonb_build_object('redemption_id',v_redemption.id,'redemption_code',v_code,'coins_spent',v_reward.cost_coins);
end; $$;

-- RLS
alter table public.profiles enable row level security;
alter table public.machines enable row level security;
alter table public.reward_rates enable row level security;
alter table public.wallets enable row level security;
alter table public.deposits enable row level security;
alter table public.coin_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.redemptions enable row level security;
alter table public.notifications enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "machines read authenticated" on public.machines for select to authenticated using (true);
create policy "rates read authenticated" on public.reward_rates for select to authenticated using (true);
create policy "wallet read own" on public.wallets for select to authenticated using (user_id = auth.uid());
create policy "deposits read own" on public.deposits for select to authenticated using (user_id = auth.uid());
create policy "transactions read own" on public.coin_transactions for select to authenticated using (user_id = auth.uid());
create policy "rewards read active" on public.rewards for select to authenticated using (active = true);
create policy "redemptions read own" on public.redemptions for select to authenticated using (user_id = auth.uid());
create policy "notifications read own" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications update own" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant execute on function public.simulate_deposit(text,text,numeric,integer) to authenticated;
grant execute on function public.redeem_reward(uuid) to authenticated;
grant select on public.profiles,public.machines,public.reward_rates,public.wallets,public.deposits,public.coin_transactions,public.rewards,public.redemptions,public.notifications to authenticated;
