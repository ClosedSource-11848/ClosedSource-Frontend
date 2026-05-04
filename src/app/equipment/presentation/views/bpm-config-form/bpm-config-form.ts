import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';
import { ConfigureBpmCommand } from '../../../domain/model/configure-bpm.command';

@Component({
  selector: 'app-bpm-config-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './bpm-config-form.html',
  styleUrl: './bpm-config-form.css',
})
export class BpmConfigForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(EquipmentStore);

  protected readonly equipmentId = signal<string | null>(null);

  protected form: FormGroup = this.fb.group({
    parameterName: ['', [Validators.required]],
    minValue: [null, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
    maxValue: [null, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
    unit: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.equipmentId.set(id);
  }

  protected onSave(): void {
    if (this.form.invalid || !this.equipmentId()) return;

    const command: ConfigureBpmCommand = {
      equipmentId: this.equipmentId()!,
      ...this.form.value,
    };

    this.store.configureBpm(command);
  }
}
