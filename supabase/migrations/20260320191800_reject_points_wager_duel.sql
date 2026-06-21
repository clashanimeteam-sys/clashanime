-- Opponent can reject a pending points wager invite (refunds creator stake)

create or replace function public.reject_points_wager_duel(p_duel_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
  duel_row public.points_wager_duels%rowtype;
begin
  if caller_id is null then
    raise exception 'not authenticated';
  end if;

  select * into duel_row
  from public.points_wager_duels
  where id = p_duel_id
  for update;

  if not found then
    raise exception 'duel not found';
  end if;

  if duel_row.status <> 'pending' then
    raise exception 'duel not pending';
  end if;

  if duel_row.opponent_id <> caller_id then
    raise exception 'not invited to this duel';
  end if;

  perform public.award_points(
    duel_row.creator_id,
    duel_row.wager_points,
    'points_duel_refund',
    jsonb_build_object('duel_id', p_duel_id, 'reason', 'rejected')
  );

  update public.points_wager_duels
  set status = 'cancelled', resolved_at = now()
  where id = p_duel_id;

  return p_duel_id;
end;
$$;

grant execute on function public.reject_points_wager_duel(uuid) to authenticated, service_role;
