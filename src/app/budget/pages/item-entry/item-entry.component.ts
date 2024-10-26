import { Component, inject } from '@angular/core';
import { Item, ItemStatus } from '../../models/item';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemService } from '../../item.service';
import { MobileFormatPipe } from '../../../shared/pipes/mobile-format.pipe';
import { DecimalPipe, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BudgetPlanComponent } from '../../components/budget-plan/budget-plan.component';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,MobileFormatPipe, DecimalPipe, RouterLink, BudgetPlanComponent],
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {

  itemService = inject(ItemService)
  location = inject(Location);

  items: Item[] = [];

  isSmallTable = false;
  filterItems = this.items;

  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  constructor() {
    this.itemService.list().subscribe(vs => {
      this.items = vs;
      this.filterItems = vs;
    })

    this.filterInput.valueChanges
      .pipe(map(keyword => keyword.toLocaleLowerCase()))
      .subscribe(keyword => {
        const numericKeyword = parseInt(keyword, 10);

        this.filterItems = this.items.filter(item => item.title.toLocaleLowerCase().includes(keyword)
        || item.price === numericKeyword
        || item.amount === numericKeyword
        || item.contactMobileNo.toLocaleLowerCase().includes(keyword)
        || item.status.toLocaleLowerCase().includes(keyword)
      )
      })
  }
  // onReload(): void {
  //   window.location.reload();
  // }

  // onDelete(id: number) {
  //   this.itemService.deletedata(id).subscribe(() => this.onReload());
  // }


  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id)
      }
    })

  }

  onDelete(id: number) {
    return this.itemService.delete(id).subscribe(v => {
      this.items = this.items.filter(item => item.id != id)
      this.filterItems = this.items
    });
  }  
}
