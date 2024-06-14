import mongoose from 'mongoose';

const ApplicationFormSchema = new mongoose.Schema({
    Name: String,
    Age: String,
    Resume: {
        data: Buffer,
        contentType: String
    },
    ApplyingForDepartment: String,
    ApplyingForPosition: String
});

const ApplicationFormModel = mongoose.model('ApplicationForm',ApplicationFormSchema);
export default ApplicationFormModel;