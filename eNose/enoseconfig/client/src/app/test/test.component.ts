import { Component, OnInit } from '@angular/core';
import { BredService } from '../layout/bread.service';
import { TestService } from './test.service';

declare const Swal: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  isEdit = false
  constructor(private bredService: BredService, private testService: TestService) { }
  
  ngOnInit(): void{
    this.bredService.title.next({
      icon: "microchip",
      // text: "Sensors"
      text: "IP Address"
  
    })
  }

  makeEditable(){
    this.isEdit = true
  }

  editCancel(){
    this.isEdit = false
  }

  restart() {
    this.testService.systemRestart()
      .then((res) => {
        Swal.fire({
          title: "System Restart",
          text: "Please don't refresh and close this window",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })
        this.testService.pingSystem(10)
      })
      .catch((err) => {

      })
  }
  
  factoryReset() {
    Swal.fire({
      title: "System Factory Reset",
      text: "Please don't refresh and close this window",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.testService.systemFactoryReset()
          .then((res) => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
          })
          .catch((err) => console.log)
      },
    })

  }

}
