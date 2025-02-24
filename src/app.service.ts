import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Rootstock Explorer API v3. Get API documentation at /doc .';
  }
}
