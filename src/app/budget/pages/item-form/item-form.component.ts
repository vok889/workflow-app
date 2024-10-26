// item-form.component.ts
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe, Location } from '@angular/common';
import { thMobile } from '../../../shared/validators/th-mobile.validator';
import { ItemService } from '../../item.service';
import { ItemStatus } from '../../models/item';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate } from '../../../auth/guards/can-deactivate.guard';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit ,CanComponentDeactivate{

  @Input()
  id: number | null = null;

  // injects
  location = inject(Location);
  fb = inject(NonNullableFormBuilder)
  itemService = inject(ItemService)
  route = inject(ActivatedRoute);

  // formControls
  title = this.fb.control<string>('', { validators: Validators.required });
  contactMobileNo = this.fb.control<string>('', { validators: [Validators.required, thMobile] });
  amount = this.fb.control<number>(0, { validators: [Validators.required, Validators.min(1)] });
  price = this.fb.control<number>(0, { validators: [Validators.required, Validators.min(0.5)] });

  // formGroup
  fg = this.fb.group({
    title: this.title,
    contactMobileNo: this.contactMobileNo,
    amount: this.amount,
    price: this.price
  })

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!
    console.log('id', this.id)
    if (this.id) {
      console.log("true")
      this.itemService.get(this.id).subscribe(v => this.fg.patchValue(v))
    }
  }


  onBack(): void {
    this.location.back();
  }

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;
  
  onSubmit(): void {
    const item = {...this.fg.getRawValue() };
    console.log(item)
    if (this.id) {
      this.itemService.edit(this.id, item).subscribe(() => this.onBack());
    } else {
      this.itemService.add(item).subscribe(() => this.onBack())
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log('canDeactivate')
    // check is dirty-form
    const isFormDirty = this.fg.dirty
    console.log('isFormDirty', isFormDirty)
    if (!isFormDirty) {
      return true;
    }

    // init comfirm modal
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to leave" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);

    return new Observable<boolean>((observer) => {
      this.bsModalRef?.onHidden?.subscribe(() => {
        observer.next(this.bsModalRef?.content?.confirmed);
        observer.complete()
      })  
    })
  }
}
