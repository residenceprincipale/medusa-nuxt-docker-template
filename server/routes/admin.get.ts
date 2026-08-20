export default defineEventHandler((event) => {
  const admin = useRuntimeConfig(event).public.adminUrl
  return sendRedirect(event, admin, 302)
})
