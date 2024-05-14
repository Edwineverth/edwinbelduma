import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original array if searchText is empty', () => {
    const items = [{ name: 'Apple', description: 'Fruit' }];
    expect(pipe.transform(items, '')).toEqual(items);
  });

  it('should filter by name', () => {
    const items = [
      { name: 'Apple', description: 'Fruit' },
      { name: 'Banana', description: 'Yellow fruit' },
      { name: 'Grapefruit', description: 'Citrus fruit' }
    ];
    expect(pipe.transform(items, 'apple')).toEqual([{ name: 'Apple', description: 'Fruit' }]);
  });

  it('should filter by description', () => {
    const items = [
      { name: 'Apple', description: 'Red fruit' },
      { name: 'Banana', description: 'Long yellow fruit' },
      { name: 'Carrot', description: 'Vegetable' }
    ];
    expect(pipe.transform(items, 'yellow')).toEqual([
      { name: 'Banana', description: 'Long yellow fruit' }
    ]);
  });

  it('should return empty array if no matches found', () => {
    const items = [
      { name: 'Apple', description: 'Red fruit' },
      { name: 'Banana', description: 'Yellow fruit' },
      { name: 'Carrot', description: 'Vegetable' }
    ];
    expect(pipe.transform(items, 'orange')).toEqual([]);
  });

  it('should handle case sensitivity', () => {
    const items = [
      { name: 'apple', description: 'Fruit' },
      { name: 'Banana', description: 'fruit' },
      { name: 'Carrot', description: 'vegetable' }
    ];
    expect(pipe.transform(items, 'FRUIT')).toEqual([
      { name: 'apple', description: 'Fruit' },
      { name: 'Banana', description: 'fruit' }
    ]);
  });
});
