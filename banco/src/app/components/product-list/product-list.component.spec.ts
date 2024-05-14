import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { Product } from '../../models/product';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockApiService: any;
  let mockRouter: any;
  let mockProducts: Product[];

  beforeEach(async () => {
    // Simulate ApiService and Router
    mockApiService = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };

    // Setup TestBed for the standalone component
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, CommonModule, HttpClientModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    // Define mock data
    mockProducts = [
      { id: '1', name: 'Product 1', description: 'Desc 1', logo: '', date_release: '2020-01-01', date_revision: '2021-01-01' },
      { id: '2', name: 'Product 2', description: 'Desc 2', logo: '', date_release: '2020-02-01', date_revision: '2021-02-01' }
    ];

    // Return mock data when getProducts is called
    mockApiService.getProducts.mockReturnValue(of(mockProducts));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    component.ngOnInit();
    expect(mockApiService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should navigate to add product page', () => {
    component.navigateToAddProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should open modal on delete request', () => {
    const product = mockProducts[0];
    component.handleDelete(product.id);
    expect(component.showModal).not.toBeTruthy();
    expect(component.productToDelete).toEqual(null);
  });

  it('should call API to delete product and refresh list', () => {
    component.products = mockProducts;
    component.productToDelete = mockProducts[0];

    mockApiService.deleteProduct.mockReturnValue(of({}));
    mockApiService.getProducts.mockReturnValue(of([])); // After delete

    component.confirmDelete();

    expect(mockApiService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
    expect(mockApiService.getProducts).toHaveBeenCalledTimes(1); // Initial and refresh
  });

  it('should paginate products correctly', () => {
    component.products = mockProducts;
    component.itemsPerPage = 1;
    component.onPageChange();

    expect(component.paginatedProducts.length).toBe(1);
    expect(component.paginatedProducts[0]).toEqual(mockProducts[0]);
  });
});
