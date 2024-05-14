import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Product } from '../models/product';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hayan solicitudes pendientes
  });

  it('should retrieve products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_release: '2024-01-01', date_revision: '2025-01-01' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'Logo 2', date_release: '2024-02-01', date_revision: '2025-02-01' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne({ method: 'GET', url: mockApiUrl });
    expect(req.request.headers.get('authorId')).toBe("1");
    req.flush(mockProducts);
  });

  it('should add a new product', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'Logo 3', date_release: '2024-03-01', date_revision: '2025-03-01' };

    service.createProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne({ method: 'POST', url: mockApiUrl });
    expect(req.request.headers.get('authorId')).toBe("1");
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: 'Updated Logo', date_release: '2024-01-01', date_revision: '2025-01-01' };

    service.updateProduct(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne({ method: 'PUT', url: mockApiUrl });
    expect(req.request.headers.get('authorId')).toBe("1");
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne({ method: 'DELETE', url: `${mockApiUrl}/${productId}` });
    expect(req.request.headers.get('authorId')).toBe("1");
    req.flush({});
  });

  it('should verify product ID', () => {
    const productId = '1';
    const verificationResult = true;

    service.verifyProductId(productId).subscribe(isTaken => {
      expect(isTaken).toBe(verificationResult);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/verification?id=${productId}`);
    req.flush(verificationResult);
  });
});
