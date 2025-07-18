import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Title } from "../models/bredcrumb";
@Injectable({
    providedIn:"root"
})
export class BredService{
    title:Subject<Title> = new Subject<Title>()
    
}