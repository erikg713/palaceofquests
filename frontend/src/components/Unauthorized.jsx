export default function Unauthorized({ user }) {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>Hello {user.username}, you do not have permission to view this dashboard.</p>
    </div>
  );
}
