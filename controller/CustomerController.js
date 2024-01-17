import {CustomerModel} from "../model/CustomerModel.js";
import {CustomerAPI} from "../db/customerAPI.js";
//import {setCustomerIds} from "./OrderController.js";


var row_index = null;
const contact_regex = new RegExp("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");

let customerApi = new CustomerAPI();

const clear = () => {
    $("#customerId").val("");
    $("#customerName").val("");
    $("#customerAddress").val("");
    $("#contactNo").val("");
}

console.log("hi");
function populateCustomerTable(){
    customerApi.getAllCustomer()
        .then((responseText) => {
            let customer_db = JSON.parse(responseText);
            console.log(customer_db===null);
            $('#customer-tbl-body').eq(0).empty();
            customer_db.forEach((customer) => {
                console.log(customer.customer_id);
                $('#customer-tbl-body').eq(0).append(
                    `<tr>
                        <th row='span'>${customer.customer_id}</th>
                        <td>${customer.customer_name}</td>
                        <td>${customer.customer_address}</td>
                        <td>${customer.customer_contact}</td>
                    </tr>`
                );
            });
        })
        .catch((error) => {
            console.log(error);
            showError('fetch Unsuccessful', error);
        });
}

// submit
$("#customerButton>button[type='button']").eq(0).on("click", () =>{
    let customer_id = $("#customerId").val();
    let customer_name = $("#customerName").val();
    let customer_address = $("#customerAddress").val();
    let customer_contact = $("#contactNo").val();

    if (validate(customer_id,'customer Id') && validate(customer_name,'customer name') &&
        validate(customer_address,'customer address') &&validate(customer_contact,'customer contact')) {
        if (customer_contact.match(contact_regex)) {

                Swal.fire({
                    title: 'Do you want to save the changes?',
                    showDenyButton: true,
                    confirmButtonText: 'Save',
                    denyButtonText: `Don't save`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log(customer_id, customer_name);

                        let customer_obj = new CustomerModel(customer_id, customer_name, customer_address, customer_contact);

                        let jsonCustomer = JSON.stringify(customer_obj);

                        // customer_db.push(customer_obj);

                        $.ajax({
                            url:"http://localhost:8080/page/customer",
                            type:"POST",
                            data:jsonCustomer,
                            headers:{"Content-Type":"application/json"},
                            success:(res)=>{
                                console.log(JSON.stringify(res))
                            },
                            error:(err)=>{
                                console.log(err)
                            }
                        })

                        populateCustomerTable();
                        //setCustomerIds();

                        clear();

                        Swal.fire('Customer Saved!', '', 'success');

                    } else if (result.isDenied) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                });


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Customer is already exists 😔',
                });
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Contact number is not valid! 😔',
            });
        }

})

$('#customer_page').eq(0).on('click',function(){
    console.log("hi");
    populateCustomerTable();
});

//update
/*$("#customerButton>button[type='button']").eq(1).on("click", () =>{
    let customer_id = $("#customerId").val();
    let customer_name = $("#customerName").val();
    let customer_address = $("#customerAddress").val();
    let customer_contact = $("#contactNo").val();

    if (validate(customer_id,'customer Id') && validate(customer_name,'customer name') &&
        validate(customer_address,'customer address') &&validate(customer_contact,'customer contact')) {

        if (customer_contact.match(contact_regex)) {

            let customer_obj = new CustomerModel(customer_id, customer_name, customer_address, customer_contact);

            let index = customerApi.findIndex(item => item.customer_id === customer_id);

            if (index >= 0) {
                Swal.fire({
                    title: 'Do you want to update the customer?',
                    showDenyButton: true,
                    confirmButtonText: 'Update',
                    denyButtonText: `Don't update`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        customerApi[index] = customer_obj;

                        loadStudentData();

                        clear();

                        Swal.fire('Customer Updated!', '', 'success');

                    } else if (result.isDenied) {
                        Swal.fire('Changes are not updated!', '', 'info')
                    }
                });


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Customer did not exists 😓',
                });
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Contact number is not valid! 😔',
            });
        }
    }
})

//delete
$("#customerButton>button[type='button']").eq(2).on("click", () =>{
    let customer_id = $("#customerId").val();

    if (validate(customer_id,'customer Id')){

        let index = customerApi.findIndex(item => item.customer_id === customer_id);

        if (index >= 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    customerApi.splice(index, 1);

                    loadStudentData();
                    setCustomerIds();

                    clear();

                    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                }
            });


        }else{
            Swal.fire({
                icon: 'error',
                title: 'Customer did not exists 😓',
            });
        }
    }
})*/
$("#customer-tbl-body").on("click", "tr", function () {
    row_index = $(this).index();

    let customer_id = $(this).find(".customer_id").text();
    let customer_name = $(this).find(".customer_name").text();
    let customer_address = $(this).find(".customer_address").text();
    let customer_contact = $(this).find(".customer_contact").text();

    $("#customerId").val(customer_id);
    $('#customerName').val(customer_name);
    $('#customerAddress').val(customer_address);
    $('#contactNo').val(customer_contact);
})

function validate(value, field_name){
    if (!value){
        Swal.fire({
            icon: 'warning',
            title: `Please enter the ${field_name}!`
    });
        return false;
    }
    return true;
}

const getCustomerIndex = function (customerId) {
    return customerApi.findIndex(customer => customer.customer_id === customerId);
}
