import { Test, TestingModule } from '@nestjs/testing';
import { WsException } from '@nestjs/websockets';
import { StateService } from 'src/state/state.service';
import { Player } from 'src/common_model/player.model';
import { Inventory } from '@Common/items/inventory.model';
import { ItemsService } from '@Items/items.service';

describe('Items Service', () => {
  let itemsService: ItemsService;
  let app: TestingModule;

  const mockPlayer = new Player('mock_player', 0, 0);
  const stateService = {
    getItemDefinition: (item) => {
      return item;
    },
    findConnectedPlayer: () => {
      return mockPlayer;
    },
    itemExists: () => true,
    itemDefinitions: [],
  };
  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: StateService,
          useValue: stateService,
        },
      ],
    }).compile();

    itemsService = app.get<ItemsService>(ItemsService);
  });
  beforeEach(() => {
    mockPlayer.inventory = new Inventory();
  });

  describe('Add Item:', () => {
    it('should add item to first slot in inventory', () => {
      const inventory = itemsService.addItem(mockPlayer, {
        name: 'mock_item',
      } as any);
      expect(inventory.items[0].name).toBe('mock_item');
    });

    it('should add item to first stack in inventory', () => {
      mockPlayer.inventory.items = [
        { name: 'mock_item', maxStackSize: 2, stackSize: 1 } as any,
      ];
      const inventory = itemsService.addItem(mockPlayer, {
        name: 'mock_item',
      } as any);
      expect(inventory.items[0].stackSize).toBe(2);
    });

    it('should add item to first stack in inventory (index 0 is taken)', () => {
      mockPlayer.inventory.items = [
        { name: 'other_item', maxStackSize: 2, stackSize: 1 } as any,
        { name: 'mock_item', maxStackSize: 2, stackSize: 1 } as any,
      ];
      const inventory = itemsService.addItem(mockPlayer, {
        name: 'mock_item',
      } as any);
      expect(inventory.items[0]).toStrictEqual({
        name: 'other_item',
        maxStackSize: 2,
        stackSize: 1,
      });
      expect(inventory.items[1].stackSize).toBe(2);
      expect(inventory.items[1].name).toBe('mock_item');
    });

    it('should throw if the inventory is full', () => {
      mockPlayer.inventory = new Inventory(1);
      mockPlayer.inventory.items = [{ name: 'another_item' } as any];
      const shouldThrow = () => {
        itemsService.addItem(mockPlayer, {
          name: 'mock_item',
        } as any);
      };
      expect(shouldThrow).toThrow(WsException);
      expect(shouldThrow).toThrow('player inventory is full');
    });
  });

  describe('Remove Item:', () => {
    it('should remove item from slot in inventory', () => {
      mockPlayer.inventory.items = [
        {
          name: 'mock_item',
          stackSize: 1,
        } as any,
      ];
      const inventory = itemsService.removeItem(mockPlayer, {
        name: 'mock_item',
      } as any);
      expect(inventory.items[0]).toBe(null);
      expect(inventory.items.filter(Boolean).length).toBe(0);
    });

    it('should remove one(1) item from slot in inventory', () => {
      mockPlayer.inventory.items = [
        {
          name: 'mock_item',
          stackSize: 2,
        } as any,
      ];
      const inventory = itemsService.removeItem(mockPlayer, {
        name: 'mock_item',
      } as any);
      expect(inventory.items[0].stackSize).toBe(1);
    });
  });

  describe('Equip Item:', () => {
    it('should equip item to head and remove from inventory', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        equipable: {
          type: 'HEAD',
        },
      } as any;
      mockPlayer.inventory.items = [mockItem];
      expect(mockPlayer.inventory.equiped.head.name).toBe(undefined);
      const inventory = itemsService.equipItem(mockPlayer, mockItem);
      expect(inventory.equiped.head.name).toBe('mock_item');
      expect(inventory.items[0]).toBe(null);
    });
    it('should throw if item not equipable', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
      } as any;
      mockPlayer.inventory.items = [mockItem];
      const throwing = () => itemsService.equipItem(mockPlayer, mockItem);
      expect(throwing).toThrow(WsException);
      expect(throwing).toThrow('mock_item is not equipable');
    });
  });

  describe('Unequip Item:', () => {
    it('should unequip item from head and add to inventory', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        equipable: {
          type: 'HEAD',
        },
      } as any;
      mockPlayer.inventory.equiped.head = mockItem;
      expect(mockPlayer.inventory.equiped.head.name).toBe(mockItem.name);
      const inventory = itemsService.unequipItem(mockPlayer, mockItem);
      expect(inventory.equiped.head.name).toBe(undefined);
      expect(inventory.items[0]).toStrictEqual(mockItem);
    });
    it('should throw if item not equiped', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        equipable: {
          type: 'HEAD',
        },
      } as any;
      const throwing = () => itemsService.unequipItem(mockPlayer, mockItem);
      expect(throwing).toThrow(WsException);
      expect(throwing).toThrow('no equiped item found on HEAD');
    });
  });

  describe('Craft Item:', () => {
    it('should craft item', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: [{ name: 'mock_source_item' }],
        },
      } as any;

      mockPlayer.inventory.items = [
        {
          name: 'mock_source_item',
          stackSize: 1,
        } as any,
      ];

      const inventory = itemsService.craftItem(mockPlayer, mockItem);
      expect(inventory.items[0]).toStrictEqual(mockItem);
    });

    it('should craft item with multiple sourceItems', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: [
            { name: 'mock_source_item' },
            { name: 'mock_source_item2' },
          ],
        },
      } as any;
      mockPlayer.inventory.items = [
        {
          name: 'mock_source_item',
          stackSize: 1,
        } as any,
        {
          name: 'mock_source_item2',
          stackSize: 1,
        } as any,
      ];
      const inventory = itemsService.craftItem(mockPlayer, mockItem);
      expect(inventory.items[0]).toStrictEqual(mockItem);
    });

    it('should craft item with required amount more than one', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: [{ name: 'mock_source_item', requiredAmount: 2 }],
        },
      } as any;
      mockPlayer.inventory.items = [
        {
          name: 'mock_source_item',
          stackSize: 2,
        } as any,
      ];
      const inventory = itemsService.craftItem(mockPlayer, mockItem);
      expect(inventory.items[0]).toStrictEqual(mockItem);
    });

    it('should craft item with multiple sourceItems with required amount more than one', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: [
            { name: 'mock_source_item', requiredAmount: 2 },
            { name: 'mock_source_item2', requiredAmount: 2 },
          ],
        },
      } as any;
      mockPlayer.inventory.items = [
        {
          name: 'mock_source_item',
          stackSize: 2,
        } as any,
        {
          name: 'mock_source_item2',
          stackSize: 2,
        } as any,
      ];
      const inventory = itemsService.craftItem(mockPlayer, mockItem);
      expect(inventory.items[0]).toStrictEqual(mockItem);
    });

    it('should throw if not enough space in inventory', () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: ['mock_source_item'],
        },
      } as any;
      mockPlayer.inventory.items = [
        {
          name: 'mock_source_item',
          stackSize: 2,
        } as any,
      ];
      const throwing = () => itemsService.craftItem(mockPlayer, mockItem);
      expect(throwing).toThrow(WsException);
    });

    it("should throw if player doesn't have enough source items", () => {
      const mockItem = {
        name: 'mock_item',
        stackSize: 1,
        craftable: {
          sourceItems: ['mock_source_item'],
        },
      } as any;
      mockPlayer.inventory.items = [];
      const throwing = () => itemsService.craftItem(mockPlayer, mockItem);
      expect(throwing).toThrow(WsException);
    });
  });

  describe('Other methods:', () => {
    it("should upsert players inventory if it's undefined", () => {
      mockPlayer.inventory = undefined;
      itemsService.getInventory(mockPlayer);
      expect(mockPlayer.inventory).toBeDefined();
    });
    it('should move items in inventory slots', () => {
      mockPlayer.inventory.items = [
        { name: 'item1' } as any,
        { name: 'item2' } as any,
      ];
      itemsService.moveItems(mockPlayer, 0, 1);
      expect(mockPlayer.inventory.items[0].name).toBe('item2');
      expect(mockPlayer.inventory.items[1].name).toBe('item1');
    });
  });
});
