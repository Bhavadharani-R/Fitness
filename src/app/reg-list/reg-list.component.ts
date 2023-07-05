import { Component , AfterViewInit, ViewChild} from '@angular/core';
import { User } from '../models/user.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import {NgConfirmService} from 'ng-confirm-box'
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reg-list',
  templateUrl: './reg-list.component.html',
  styleUrls: ['./reg-list.component.scss']
})
export class RegListComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'mobile', 'bmiResults','gender', 'package', 'enquiryDate', 'action'];
   public  dataSource!: MatTableDataSource<User>;
    public users!: User[];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    
    constructor(private api: ApiService ,
      private toast: NgToastService, private router: Router, private confirm: NgConfirmService ){

    }
  ngAfterViewInit(): void {
  
    this.getUsers();
  }
    getUsers(){
        this.api.getRegisteredUser()
        .subscribe(res=>{
        this.users=res;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    edit(id:number){
      this.router.navigate(['update', id]);
    }
    
    delete(id: number){
      this.confirm.showConfirm("Are you sure want to delete?",
      ()=>{
        this.api.deleteRegistered(id)
        .subscribe(res=>{
          this.toast.success({detail:"SUCCESS", summary:"Deleted Successfully", duration:3000});
          this.getUsers();
        })
      },
      () =>{

      } )
      
    }


  }

