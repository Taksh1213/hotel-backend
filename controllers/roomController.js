import Room from "../models/Room.js";

// get all rooms
export const getRooms  = async (req,res) => {
    const rooms  = await Room.find();
    res.json(rooms)
    
};
// add rooms
export const addRoom = async (req,res) => {
    const room = await Room.create(req.body);
    res.json(room);
    
}
export const updateRoom = async (req,res) => {
    const room = await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(room)
    
}
// delete room
export const deleteRoom = async (req,res) => {
    await Room.findOneAndDelete(req.params.id);
    res.json({message:"Room deleted"});
};
