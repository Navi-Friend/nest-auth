import { JwtPayload } from '../auth/interfaces/jwt.interface';

declare global {
	namespace Express {
		interface Request {
			user: JwtPayload;
		}
	}
}
