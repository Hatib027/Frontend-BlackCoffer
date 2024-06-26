import { Component, OnInit } from '@angular/core';
import { BackedService } from 'src/app/services/backed.service';

@Component({
  selector: 'app-dashboardbody',
  templateUrl: './dashboardbody.component.html',
  styleUrls: ['./dashboardbody.component.css']
})

export class DashboardbodyComponent implements OnInit{
  topics:any;
  pestle:any='';
  sector:any='';
  region:any='';
  source:any='';
  country:any='';
  swot:any='';
  city:any='';
  endYear:any='';
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 15, 20];
  
  backedDataFilter:any;
  backedData:any=[{
    id:0,
    endYear:0,
    intensity:'',
    topics:'',
    sector:'',
    region:'',
    pestle:'',
    source:'',
    swot:'',
    country:'',
    city:'',
    likelihood:0,
    relevance:0,
    startYear:''
  }];

  constructor(private backedService:BackedService){

  }

  ngOnInit(): void {
   this.backedService.getBackedData().subscribe(
    (data:any)=>{
     
      this.backedData = data.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
      this.backedDataFilter = this.backedData.slice();
   
    },
    (error:any)=>{

    }
   )
  }

  public filterData(){
  
   
      this.backedDataFilter = this.topics != null  ? this.backedData.filter((data:any)=> this.backedData.topics!= '' ? data.topics.toLowerCase().includes(this.topics.trim().toLowerCase()) : false


    ) : this.backedData;
    
    
  
      // this.backedDataFilter = this.pestle != '' ? this.topics != null  ? this.backedData.filter((data:any)=> data.pestle!= null ? data.pestle.toLowerCase().startsWith(this.pestle.trim().toLowerCase()):false) :
      // this.backedDataFilter.filter((data:any)=> data.pestle!= null ? data.pestle.toLowerCase().startsWith(this.pestle.trim().toLowerCase()):false) : this.backedData
    
    
      if(this.backedDataFilter != this.backedData && this.pestle != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.pestle!= null ? data.pestle.toLowerCase().includes(this.pestle.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.pestle!= null ? data.pestle.toLowerCase().includes(this.pestle.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.sector != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.sector!= null ? data.sector.toLowerCase().includes(this.sector.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.sector!= null ? data.sector.toLowerCase().includes(this.sector.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.region != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.region!= null ? data.region.toLowerCase().includes(this.region.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.region!= null ? data.region.toLowerCase().includes(this.region.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.source != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.source!= null ? data.source.toLowerCase().includes(this.source.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.source!= null ? data.source.toLowerCase().includes(this.source.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.country != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.country!= null ? data.country.toLowerCase().includes(this.country.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.country!= null ? data.country.toLowerCase().includes(this.country.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.swot != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.swot!= null ? data.swot.toLowerCase().includes(this.swot.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.swot!= null ? data.swot.toLowerCase().includes(this.swot.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.city != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.city!= null ? data.city.toLowerCase().includes(this.city.trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.city!= null ? data.city.toLowerCase().includes(this.city.trim().toLowerCase()):false);
      }
      if(this.backedDataFilter != this.backedData && this.endYear != null){
     this.backedDataFilter =   this.backedDataFilter.filter((data:any)=> data.endYear!= null ? data.endYear.toString().toLowerCase().includes(this.endYear.toString().trim().toLowerCase()):false);
      }else{
        this.backedDataFilter =   this.backedData.filter((data:any)=> data.endYear != null ? data.endYear.toString().toLowerCase().includes(this.endYear.toString().trim().toLowerCase()):false);
      }

      

 
    
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.backedDataFilter;
  }
  onTableSizeChnange(event: any): void {
    this.tableSize = event.targetvalue;
    this.page = 1;
    this.backedDataFilter;
  }

}
