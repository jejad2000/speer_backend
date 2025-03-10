import { Router } from 'express';
import UserAccessController from '../controllers/UserAccessController';
import NotesController from '../controllers/NotesController';
import {authenticateToken} from '../middleware/AuthenticateToken';

const router = Router();

//auth routes
router.post('/api/auth/signup', UserAccessController.signup);
router.post('/api/auth/login', UserAccessController.login);
router.post('/api/auth/logout', authenticateToken, UserAccessController.logout);

//notes routes
router.get('/api/notes', authenticateToken, NotesController.getAllNotes);
router.get('/api/notes/:id', authenticateToken, NotesController.getNote);
router.post('/api/notes', authenticateToken, NotesController.createNote);
router.put('/api/notes/:id', authenticateToken, NotesController.updateNote);
router.delete('/api/notes/:id', authenticateToken, NotesController.deleteNote);
router.post('/api/notes/:id/share', authenticateToken, NotesController.shareNote);
router.get('/api/search', authenticateToken, NotesController.getSearchNote);

export default router;
