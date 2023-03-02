
export default function Users({setSelectedUser, activeUsers, users}){
  return (
		<div className="flex h-screen flex-col text-white bg-slate-500">
			{users.map((user) => {
				// const currentUserInfo = activeUsers.map((activeUser) => {
				// 	return activeUser.username === user
				// })

				return (
					<div onClick={() => setSelectedUser(user)}>
						<p>{user.username}{user.self ? '(Yourself)' : ''}</p>
						<p>{user.connected ? 'Connected' : 'Not connected'} {user.hasNewMessages ? "New!": ''}</p>
					</div>
				)
			})}
		</div>
	)
};