const PetProfile = require('../models/PetProfile.js'); // Ensure this file exists and is correctly implemented
const User = require('../models/User'); // Ensure this file exists and is correctly implemented
const Notification = require('../models/Notification'); // Ensure this file exists and is correctly implemented
const AdoptionRequest = require('../models/AdoptionRequest');


// alvee
const createNotification = async (userId, message, type = 'info') => {
    const notification = new Notification({
        userId,
        message,
        type
    });
    await notification.save();
};




// rupom
  exports.addvaccination = async (req, res) => {
    const petId = req.params.petId;
    const { vaccineName, date, notes, nextVaccinationDate } = req.body;
  
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
  
        pet.vaccinations.push({ vaccineName, date, notes, nextVaccinationDate });
  
        const updatedPet = await pet.save();
        await createNotification(pet.owner, ` ${pet.name}'s vaccination added.`);
  
        res.status(201).json({ message: 'Vaccination added', pet: updatedPet });
    } catch (err) {
        console.error('Error adding vaccination:', err);
        res.status(500).json({ message: 'Failed to add vaccination', error: err });
    }
  }


  exports.updatevaccination = async (req, res) => {
    const { petId, vaccinationId } = req.params;
    const { vaccineName, date, notes, nextVaccinationDate } = req.body;

    try {
        console.log(`Editing vaccination for petId: ${petId}, vaccinationId: ${vaccinationId}`); // Log IDs

        const pet = await PetProfile.findById(petId);
        if (!pet) {
            console.error(`Pet not found for ID: ${petId}`); // Log if pet not found
            return res.status(404).json({ message: 'Pet not found' });
        }

        const vaccination = pet.vaccinations.id(vaccinationId);
        if (!vaccination) {
            console.error(`Vaccination not found for ID: ${vaccinationId}`); // Log if vaccination not found
            return res.status(404).json({ message: 'Vaccination not found' });
        }

        vaccination.vaccineName = vaccineName || vaccination.vaccineName;
        vaccination.date = date || vaccination.date;
        vaccination.notes = notes || vaccination.notes;
        vaccination.nextVaccinationDate = nextVaccinationDate || vaccination.nextVaccinationDate;

        const updatedPet = await pet.save();
        console.log('Updated pet after vaccination edit:', updatedPet); // Log the updated pet details

        res.status(200).json({ message: 'Vaccination updated successfully', pet: updatedPet });
    } catch (err) {
        console.error('Error updating vaccination:', err); // Log the error
        res.status(500).json({ message: 'Failed to update vaccination', error: err });
    }
}



exports.deletevaccination =async (req, res) => {
    const { petId, vaccinationId } = req.params;

    try {
        console.log(`Attempting to delete vaccination with ID: ${vaccinationId} for pet ID: ${petId}`);

        const pet = await PetProfile.findById(petId);
        if (!pet) {
            console.error(`Pet not found for ID: ${petId}`);
            return res.status(404).json({ message: 'Pet not found' });
        }

        const vaccination = pet.vaccinations.id(vaccinationId);
        if (!vaccination) {
            console.error(`Vaccination not found for ID: ${vaccinationId}`);
            return res.status(404).json({ message: 'Vaccination not found' });
        }

        // Check if the vaccination date has passed
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const vaccinationDate = new Date(vaccination.nextVaccinationDate);
        vaccinationDate.setHours(0, 0, 0, 0);

        if (vaccinationDate > today) {
            return res.status(403).json({ 
                message: 'Cannot delete vaccination before its due date',
                dueDate: vaccinationDate
            });
        }

        const updatedVaccinations = pet.vaccinations.filter(
            (vaccination) => vaccination._id.toString() !== vaccinationId
        );

        pet.vaccinations = updatedVaccinations;
        const updatedPet = await pet.save();
        console.log('Updated pet after vaccination deletion:', updatedPet);

        res.status(200).json({ message: 'Vaccination deleted successfully', pet: updatedPet });
    } catch (err) {
        console.error('Error deleting vaccination:', err);
        res.status(500).json({ message: 'Failed to delete vaccination', error: err });
    }
}


exports.addvetappointment = async (req, res) => {
    const petId = req.params.petId;
    const { doctorName, address, dateOfAppointment, notes } = req.body; // Include notes
  
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
  
        const newAppointment = { doctorName, address, dateOfAppointment, notes };
        pet.vetAppointments.push(newAppointment);
  
        const updatedPet = await pet.save();
        await createNotification(pet.owner, ` ${pet.name}'s vet appointment added.`)
        res.status(201).json({ message: 'Vet appointment added', pet: updatedPet });
    } catch (err) {
        console.error('Error adding vet appointment:', err);
        res.status(500).json({ message: 'Failed to add vet appointment', error: err });
    }
  }




  exports.updateVetAppointment = async (req, res) => {
    const { petId, appointmentId } = req.params;
    const { doctorName, address, dateOfAppointment, notes } = req.body;

    console.log(`Editing appointment for petId: ${petId}, appointmentId: ${appointmentId}`); // Log pet and appointment IDs
    console.log('Request body:', req.body); // Log the incoming request body

    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) {
            console.error(`Pet not found for ID: ${petId}`); // Log if pet not found
            return res.status(404).json({ message: 'Pet not found' });
        }

        const appointment = pet.vetAppointments.id(appointmentId);
        if (!appointment) {
            console.error(`Appointment not found for ID: ${appointmentId}`); // Log if appointment not found
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.doctorName = doctorName || appointment.doctorName;
        appointment.address = address || appointment.address;
        appointment.dateOfAppointment = dateOfAppointment || appointment.dateOfAppointment;
        appointment.notes = notes || appointment.notes;

        const updatedPet = await pet.save();
        console.log('Updated pet:', updatedPet); // Log the updated pet details

        res.status(200).json({ message: 'Appointment updated successfully', pet: updatedPet });
    } catch (err) {
        console.error('Error updating appointment:', err); // Log the error
        res.status(500).json({ message: 'Failed to update appointment', error: err });
    }
}


exports.deleteVetAppointment =async (req, res) => {
    const { petId, appointmentId } = req.params;

    try {
        console.log(`Attempting to delete appointment with ID: ${appointmentId} for pet ID: ${petId}`);

        const pet = await PetProfile.findById(petId);
        if (!pet) {
            console.error(`Pet not found for ID: ${petId}`);
            return res.status(404).json({ message: 'Pet not found' });
        }

        const appointment = pet.vetAppointments.id(appointmentId);
        if (!appointment) {
            console.error(`Appointment not found for ID: ${appointmentId}`);
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the appointment date has passed
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(appointment.dateOfAppointment);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate > today) {
            return res.status(403).json({ 
                message: 'Cannot delete appointment before its scheduled date',
                appointmentDate: appointmentDate
            });
        }

        const updatedAppointments = pet.vetAppointments.filter(
            (appointment) => appointment._id.toString() !== appointmentId
        );

        pet.vetAppointments = updatedAppointments;
        const updatedPet = await pet.save();
        console.log('Updated pet after deletion:', updatedPet);

        res.status(200).json({ message: 'Appointment deleted successfully', pet: updatedPet });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ message: 'Failed to delete appointment', error: err });
    }
}






exports.addHealthLog = async (req, res) => {
    const { petId } = req.params;
    const { date, weight, diet, medicalNotes } = req.body;
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        pet.healthLogs.push({ date, weight, diet, medicalNotes });
        const updatedPet = await pet.save();
        res.status(201).json({ message: 'Health log added', pet: updatedPet });
    } catch (err) {
        console.error('Error adding health log:', err);
        res.status(500).json({ message: 'Failed to add health log', error: err });
    }
}


exports.getHealthLogs =async (req, res) => {
    const { petId } = req.params;
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.status(200).json({ healthLogs: pet.healthLogs });
    } catch (err) {
        console.error('Error fetching health logs:', err);
        res.status(500).json({ message: 'Failed to fetch health logs', error: err });
    }
}


exports.getHealthLogByDate = async (req, res) => {
    const { petId, date } = req.params;
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        const log = pet.healthLogs.find(l => new Date(l.date).toISOString().slice(0,10) === new Date(date).toISOString().slice(0,10));
        if (!log) return res.status(404).json({ message: 'Health log not found for this date' });
        res.status(200).json({ healthLog: log });
    } catch (err) {
        console.error('Error fetching health log by date:', err);
        res.status(500).json({ message: 'Failed to fetch health log', error: err });
    }
}