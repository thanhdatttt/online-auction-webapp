const SideBar = () => {
  return (
    <aside>
			{/* profile */}
      <div>
				<h3>Profile</h3>
				<ul>
					<li>Watch List</li>
					<li>Feedback</li>
					<li>Active Bids</li>
					<li>Auction Won</li>
				</ul>
			</div>

			{/* setting */}
			<div>
				<h3>Settings</h3>
				<ul>
					<li>Account</li>
					<li>Payment</li>
				</ul>
			</div>
    </aside>
  );
}

export default SideBar;