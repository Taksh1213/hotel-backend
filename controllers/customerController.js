import Customer from "../models/Customer.js";

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// CREATE NEW CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create customer" });
  }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update customer" });
  }
};

// DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to delete customer" });
  }
};