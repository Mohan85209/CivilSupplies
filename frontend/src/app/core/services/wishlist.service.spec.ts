import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { Product } from '../models/domain.models';

function makeProduct(id: number, slug: string): Product {
  return {
    id, slug, name: 'Demo product ' + id, categoryId: 1, brand: null, unit: null,
    description: null, imageUrl: null, isActive: true, createdAt: new Date().toISOString(),
  };
}

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistService);
  });

  it('starts empty', () => {
    expect(service.count()).toBe(0);
    expect(service.items()).toEqual([]);
  });

  it('toggles a product into and out of the wishlist', () => {
    const p = makeProduct(1, 'cement-x');
    service.toggle(p);
    expect(service.count()).toBe(1);
    expect(service.has(1)).toBeTrue();

    service.toggle(p);
    expect(service.count()).toBe(0);
    expect(service.has(1)).toBeFalse();
  });

  it('persists items across instances via localStorage', () => {
    service.toggle(makeProduct(2, 'tmt-12'));
    const fresh = TestBed.runInInjectionContext(() => new WishlistService());
    expect(fresh.count()).toBe(1);
    expect(fresh.has(2)).toBeTrue();
  });

  it('clears all items', () => {
    service.toggle(makeProduct(1, 'a'));
    service.toggle(makeProduct(2, 'b'));
    service.clear();
    expect(service.count()).toBe(0);
  });
});
