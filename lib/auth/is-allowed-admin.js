export async function isAllowedAdmin(supabase) {
  const { data, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('is_admin check failed:', error.message);
    return false;
  }

  return data === true;
}
