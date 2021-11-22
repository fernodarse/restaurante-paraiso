import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenuRestService } from 'src/app/models/menu-rest.service';
import { CategoriaMenu, ListCategoriaMenu } from 'src/app/models/staticts';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private menuServices: MenuRestService,
    private listCategoriaMenu: ListCategoriaMenu,) { }

  ngOnInit(): void {
  }

  categoriaMenu(): CategoriaMenu[] {
    return this.listCategoriaMenu.categoriaMenu;
  }

  getMenuListXCategoria(categoria: string): Menu[] {
    let menuList = this.menuServices.getAllMenus()
    let result = menuList.filter((menu) => menu.categoria == categoria);
    return result;
  }

  getMenuHtmlList(categoria: string) {
    let menuList = this.getMenuListXCategoria(categoria);
    //menuList=menuList.concat(menuList)
    //menuList=menuList.concat(menuList)
    let html = ``;
    menuList.forEach((menu, index) => {
      let articulo = `<div class="col-md-6 g-mb-50">
      <article class="media">
      <a class="g-width-100" href="#">
        <img class="img-fluid g-rounded-50x" src="${this.imagenMenu(menu)}"
          alt="Image description">
      </a>
      <div class="media-body align-self-center g-pl-10">
              <div
                  class="d-flex justify-content-between u-heading-v1-4 g-bg-main g-theme-brd-gray-light-v1 g-mb-8">
                  <h3
                      class="align-self-center u-heading-v1__title g-color-black g-font-weight-700 g-font-size-13 text-uppercase mb-0">
                      ${menu.nombre}</h3>

                  <div class="align-self-center g-pos-rel g-bg-main g-pl-15">
                      <strong
                          class="g-font-weight-700 g-font-size-13 g-color-white g-bg-primary g-rounded-3 g-py-4 g-px-12">$${this.precio(menu)}  </strong>
                  </div>
              </div>

              <p class="mb-0">${menu.descripcion}</p>
          </div>
      </article>
      </div>`;
      if (index % 2 == 0) {
        html += `<div class="row">` + articulo;
        if(index == menuList.length)  html +=`</div>`
      } else {
        html += articulo + `</div>`
      }
    });
    return html;
  }
  
  imagenMenu(menu: Menu):String{
     return menu.datosImg.url!="" ? menu.datosImg.url : "assets/img-temp/700x700/img1.png"
  }

  precio(menu: Menu){
    return parseFloat(menu.precio.toString()).toFixed(2);
  }

}
