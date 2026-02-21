import React from "react";

interface UserProfileProps {
	name: string;
	email: string;
	subscription: string;
	onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
	name,
	email,
	subscription,
	onEdit,
}) => {
	return (
		<div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
			<div className="flex items-center p-6">
				<img
					className="w-16 h-16 rounded-full object-cover"
					src="https://randomuser.me/api/portraits/men/32.jpg"
					alt="User Avatar"
				/>
				<div className="ml-4">
					<h2 className="text-xl font-semibold text-gray-800">{name}</h2>
					<p className="text-gray-600">{email}</p>
					<p className="text-gray-600">Subscription: {subscription}</p>
				</div>
			</div>
			<div className="flex justify-end p-4">
				<button
					onClick={onEdit}
					className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
				>
					Edit
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
