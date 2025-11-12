import Service from '../models/Service.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';

export const createService = async (req, res) => {
    try {
        const { title, description, price, providerId , categoryId } = req.body;
        const newService = new Service({ title, description, price, providerId , categoryId });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const DeleteService = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const UpdateService = async (req,res) => {
    const { serviceId } = req.params;
    const { title, description, price, categoryId } = req.body;
    try {
        const NewSerivce = await Service.findByIdAndUpdate(
            serviceId,
            { title, description, price, categoryId },
            { new: true }
        );
        if (!NewSerivce) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(NewSerivce);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }  
};

export const getServicesByProvider = async (req, res) => {
    const { providerId } = req.params;
    try {
        const services = await Service.find({ providerId });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export default { createService, DeleteService, UpdateService, getServicesByProvider };

// viewBookings()

// viewEarnings()

// respondToBooking()

// updateProfile()