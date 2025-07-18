import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
declare const Swal: any;
@Directive({
  selector: '[progress]'
})
export class SwlProgressDirective {

  @Input() progress: any = ""
  @Output() data: EventEmitter<string> = new EventEmitter<string>()
  @Output() start: EventEmitter<string> = new EventEmitter<string>()
  @Output() cancel: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  @HostListener('click')
  onClick() {
    let timerInterval: any;
    const config = {
        title: 'Auto close alert!',
        html: 'I will close in <b></b> milliseconds.',
        timer: 20000,
        timerProgressBar: true,
        allowOutsideClick: false,
        willOpen: ()=>{
            this.start.emit("downloaded")
        },
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = (Swal.getTimerLeft() / 1000).toFixed()
          }, 1000)
        },
        willClose: () => {
          clearInterval(timerInterval)
        },
        ...this.progress
    }
    Swal.fire(config)
      .then((result: any) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          this.data.emit("downloaded")
        }
        if(result.dismiss === Swal.DismissReason.cancel){
          this.cancel.emit("cancel")
        }
      })
  }

}
