import User from '../Models/user_model'
import { Request, Response } from 'express';

const getAllUsers = async (req:Request, res:Response) => {
    console.log("getAllUsers");
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve users from database');
    }
}

const getUserById = async (req:Request, res:Response) => {
    console.log("getUserById");
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve user from database');
    }
}

const postUser = async (req:Request, res:Response) => {
    console.log("Request Body:", req.body); // Add this line for detailed logging

    const { name, _id } = req.body;

    try {
        if (!name || !_id) {
            return res.status(400).send('Both name and _id are required');
        }
        const user = new User({ name, _id });
        await user.save();
        res.status(200);
        res.send('User saved to database');
    } catch (err) {
        res.status(500).send('Unable to save user to database');
    }
}

const putUser = async (req:Request, res:Response) => {
    console.log("putUser");
    try {
        const { name, _id } = req.body;
        if (!name || !_id) {
            return res.status(400).send('Both name and _id are required');
        }
        await User.findByIdAndUpdate(req.params.id, { name, _id });
        res.send('User updated in database');
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to update user in database');
    }

}

const deleteUser = async (req:Request, res:Response) => {
    console.log("deleteUser");
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send('User deleted from database');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to delete user from database');
    }
}

export default { getAllUsers, getUserById, postUser, putUser, deleteUser };
