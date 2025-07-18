import { Component, OnInit } from '@angular/core';

declare const bootstrap:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  ngOnInit(): void {
    setInterval(()=>{
      const alerts = document.querySelectorAll(".alert");
      alerts.forEach(function (alertNode){
        const alert = new bootstrap.Alert(alertNode)
        const time = parseInt("5000");
        setTimeout(()=>{
          alert.close();
        },time)
      })
    },100)
  }

}
