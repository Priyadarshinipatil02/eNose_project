import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
declare const Swal: any;
@Directive({
  selector: '[delete]'
})
export class SwlDirective {

  @Input() delete: any = ""
  @Output() confirm: EventEmitter<string> = new EventEmitter<string>()
  @Output() deny: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  @HostListener('click')
  onClick() {
    const config = {
      title: 'Are you sure?',
      showCancelButton: true,
      ...this.delete
    }
    Swal.fire(config)
      .then((result: any) => {
        if (result.isConfirmed) {
          this.confirm.emit("deleted")
        }else{
          this.deny.emit("not deleted")
        }
      })
  }

}
