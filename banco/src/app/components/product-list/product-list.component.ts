// src/app/components/product-list/product-list.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { ProductFormComponent } from '../product-form/product-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ProductFormComponent, FormsModule, FilterPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedProduct: Product | null = null;
  showForm: boolean = false;
  searchText: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  dropdownProductId: string | null = null; // Variable para manejar el estado del dropdown

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchProducts();
    document.addEventListener('click', this.handleClickOutsideDropdown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutsideDropdown.bind(this));
  }

  fetchProducts(): void {
    this.apiService.getProducts().subscribe(products => {
      this.products = products;
      this.paginateProducts();
    });
  }

  handleEdit(product: Product): void {
    this.selectedProduct = product;
    this.showForm = true;
  }

  handleDelete(id: string): void {
    this.apiService.deleteProduct(id).subscribe(() => this.fetchProducts());
  }

  handleSave(): void {
    this.showForm = false;
    this.selectedProduct = null;
    this.fetchProducts();
  }

  toggleDropdown(event: MouseEvent, productId: string): void {
    event.stopPropagation();
    this.dropdownProductId = this.dropdownProductId === productId ? null : productId;
  }

  handleClickOutsideDropdown(event: MouseEvent): void {
    this.dropdownProductId = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isDropdownClick(event)) {
      this.dropdownProductId = null;
    }
  }

  isDropdownClick(event: MouseEvent): boolean {
    const dropdowns = document.querySelectorAll('.dropdown-content.show');
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].contains(event.target as Node)) {
        return true;
      }
    }
    return false;
  }

  paginateProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  onPageChange(): void {
    this.currentPage = 1; // Reset to the first page when items per page changes
    this.paginateProducts();
  }
}
