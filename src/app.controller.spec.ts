import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return correct Emoji', () => {
      // Mock the request object
      const mockRequest = {
        headers: {
          browser: 'Postman',
        },
      };

      // Mock the getEmoji method to return a specific emoji
      jest.spyOn(appService, 'getEmoji').mockReturnValue('😂');

      // Use toEqual instead of toBe for object comparison
      expect(appController.getEmoji(mockRequest as any)).toEqual({
        emoji: '😂',
        browser: 'Postman',
      });
    });
  });
});
