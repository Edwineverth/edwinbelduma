import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format "2024-01-01" as "01/01/2024"', () => {
    const date = '2024-01-01';
    expect(pipe.transform(date)).toEqual('01/01/2024');
  });

  it('should format Date object for January 1, 2024 as "31/12/2023"', () => {
    const date = new Date('2024-01-01');
    expect(pipe.transform(date)).toEqual('31/12/2023');
  });

  it('should return null if the date is none', () => {
    expect(pipe.transform('')).toBeNull();
  });
});
