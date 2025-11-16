export const getMe = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({user});
    } catch (err) {
        res.status(500).json({message: "System error"});
    }
}