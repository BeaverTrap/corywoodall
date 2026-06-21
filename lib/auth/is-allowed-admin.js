export async function isAllowedAdmin(supabase, email) {
  const { data, error } = await supabase.rpc('is_admin');

  if (!error && data === true) {
    return true;
  }

  if (error) {
    console.error('is_admin rpc failed:', error.message);
  }

  let userEmail = email;
  if (!userEmail) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  }

  if (!userEmail) {
    return false;
  }

  const { data: allowed, error: allowlistError } = await supabase
    .from('admin_allowlist')
    .select('email')
    .eq('email', userEmail.toLowerCase())
    .maybeSingle();

  if (allowlistError) {
    console.error('allowlist check failed:', allowlistError.message);
    return false;
  }

  return Boolean(allowed);
}
