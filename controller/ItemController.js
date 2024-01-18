    import {ItemModel} from "../model/ItemModel.js";
    import {ItemAPI} from "../api/itemAPI.js";

    //import {customer_db, item_db} from "../db/customerAPI.js";
    //import {setCustomerIds, setItemIds} from "./OrderController.js";

    var row_index = null;

    $('#item_page').eq(0).on('click',function(){
        console.log("item");
        populateItemTable();
    });

    let itemAPI = new ItemAPI();

    let itemId = $("#itemId");
    let itemName = $('#itemName');
    let itemQty = $('#itemQty');
    let itemPrice = $('#itemPrice');

    //submit
    $("#itemButton>button[type='button']").eq(0).on("click", () =>{
       let item_code = $("#itemId").val();
       let item_name = $("#itemName").val();
       let item_qty = parseInt($("#itemQty").val());
       let item_price = parseFloat($("#itemPrice").val());

       if (validate(item_code,'item code') && validate(item_name,'item name') &&
           validate(item_qty,'item qty') && validate(item_price,'item price')) {

             Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
             }).then((result) => {
                if (result.isConfirmed) {
                   let item_obj = new ItemModel(item_code, item_name, item_qty, item_price);

                   let jsonItem = JSON.stringify(item_obj);

                   $.ajax({
                      url:"http://localhost:8080/page/item",
                      type:"POST",
                      data:jsonItem,
                      headers:{"Content-Type":"application/json"},
                      success:(res)=>{
                         console.log(JSON.stringify(res))
                      },
                      error:(err)=>{
                         console.log(err)
                      }
                   })

                   populateItemTable();
                   //setItemIds();

                   clear();

                   Swal.fire('Customer Saved!', '', 'success');

                } else if (result.isDenied) {
                   Swal.fire('Changes are not saved', '', 'info')
                }
             });
          }else{
             Swal.fire({
                icon: 'error',
                title: 'Item is already exists 😔',
             });
          }
    });

    const clear = () =>{
       $("#itemId").val("");
       $("#itemName").val("");
       $("#itemQty").val("");
       $("#itemPrice").val("");
    }

    function populateItemTable(){
       itemAPI.getAllItem()
           .then((responseText) => {
              let item_db = JSON.parse(responseText);
              console.log(item_db===null);
              $('#item_table_body').eq(0).empty();
              item_db.forEach((item) => {
                 $('#item_table_body').eq(0).append(
                     `<tr>
                            <th row='span'>${item.item_code}</th>
                            <td>${item.item_description}</td>
                            <td>${item.item_qty}</td>
                            <td>${item.item_price}</td>
                        </tr>`
                 );
              });
           })
           .catch((error) => {
              console.log(error);
              showError('fetch Unsuccessful', error);
           });
    }

    //update
    $("#itemButton>button[type='button']").eq(1).on("click", () =>{
       let item_code = $("#itemId").val();
       let item_name = $("#itemName").val();
       let item_qty = $("#itemQty").val();
       let item_price = $("#itemPrice").val();

       if (validate(item_code,'item code') && validate(item_name,'item name') &&
           validate(item_qty,'item qty') && validate(item_price,'item price')) {

           let item_obj = new ItemModel(item_code, item_name, item_qty, item_price);

           itemAPI.updateItem(item_obj)
                    .then((responseText) => {
                        Swal.fire(
                            responseText,
                            'Successful',
                            'success'
                        )
                        populateItemTable();
                        clear();

                    })
                    .catch((error) => {
                        showError('Update Unsucessfull', error);
                    });
                    clear();
          }else{
             Swal.fire({
                icon: 'error',
                title: 'Item did not exists 😓',
             });
          }
    });

    //delete
    $("#itemButton>button[type='button']").eq(2).on("click", () => {
        let item_code = $("#itemId").val();

        if (validate(item_code, 'item code')) {

            //let index = item_db.findIndex(item => item.item_code === item_code);

            let item_code = $("#itemId").val().trim();
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Delete'
            }).then((result) => {
                if (result.isConfirmed) {
                    itemAPI.deleteItem(item_code)
                        .then((responseText) => {
                            Swal.fire(
                                responseText,
                                'Successful',
                                'success'
                            )
                            populateItemTable();
                            clear();
                        })
                        .catch((error) => {
                            console.log(error);
                            showError('Item delete Unsucessfull', error);
                        });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Item did not exists 😓',
                    });
                }

            })
        }
    })


    $("#item_table_body").on("click", "tr", function () {
        row_index = $(this).find('th').text();
        console.log(row_index);
        if (row_index) {
            itemAPI.getItem(row_index)
                .then((responseText) => {
                    let item = JSON.parse(responseText);
                    itemId.val(item.item_code);
                    itemName.val(item.item_description);
                    itemQty.val(item.item_qty);
                    itemPrice.val(item.item_price);
                })
                .catch((error) => {
                    console.log(error);
                    showError('Save Unsucessfull', error);
                });
        }
    })
            function showError(title, text) {
                Swal.fire({
                    icon: 'error',
                    title: title,
                    text: text,
                    footer: '<a href="">Why do I have this issue?</a>'
                });
            }

            function validate(value, field_name) {
                if (!value) {
                    Swal.fire({
                        icon: 'warning',
                        title: `Please enter the ${field_name}!`
                    });
                    return false;
                }
                return true;
            }
