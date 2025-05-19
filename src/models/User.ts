import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript pour le document User
export interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose pour User
const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Création de l'index pour optimiser les recherches
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });

// Export du modèle
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 