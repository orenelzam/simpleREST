/**
 * Constants
 */
var PRODUCT_ADDED = 1,
    PRODUCT_DELETED = 2,
    PRODUCT_UPDATED = 3,
    PRODUCT_ADD_BOX = 4,
    PRODUCT_UPDATE_BOX = 5,
    PRODUCTS_REFRESH = 6;

/**
 * main method - executed when the document is ready
 */
$(document).ready(function () {
    var msgBoxHandle = function (msg, par) {
        switch (msg) {
        case PRODUCT_ADDED:
            $('#productForm').hide();
            $('#productMsg').removeClass('msgFail').addClass('msgOk').html(par + '<br>product ADDED.').show();
            break;
        case PRODUCT_DELETED:
            $('#productForm').hide();
            $('#productMsg').removeClass('msgOk').addClass('msgFail').html(par + '<br>product DELETED.').show();
            break;
        case PRODUCT_UPDATED:
            $('#productForm').hide();
            $('#productMsg').removeClass('msgFail').addClass('msgOk').html(par + '<br>product UPDATED.').show();
            break;
        case PRODUCT_ADD_BOX:
            $('#pid').html("Enter New Product");
            $('#productInputName').val("");
            $('#productInputDesc').val("");
            $('#btnProductForm').val("Add");
            $('#productForm').show();
            $('#productMsg').hide();
            break;
        case PRODUCT_UPDATE_BOX:
            $('#pid').html(par._id);
            $('#productInputName').val(par.name);
            $('#productInputDesc').val(par.description);
            $('#btnProductForm').val("Update");
            $('#productForm').show();
            $('#productMsg').hide();
            break;
        case PRODUCTS_REFRESH:
            $('#productForm').hide();
            $('#productMsg').hide();
            break;
        default:
        }
    },
        getProducts = function () {
            $.ajax({
                type : 'GET',
                dataType : 'json',
                url : '/products',
                success : function (data, textStatus, jqXHR) {
                    $('#productsList').html(""); // clear the content
                    $.each(data, function (key, val) {
                        renderProduct(key, val);
                    });
                    //click handler for pressing delete product
                    $('.deleteBtn').click(function () {
                        deleteProduct(this.id);
                    });
                    //open box for product update
                    $('.updateBtn').click(function () {
                        findProductById(this.id, true);
                    });
                },
                statusCode : {
                    403 : function () {
                        alert('something went wrong with getProducts');
                    }
                }
            });
        },

        addProduct = function (data) {
            $.ajax({
                type : 'POST',
                url : '/products',
                data : {
                    'name' : data.name,
                    'description' : data.description
                },
                success : function (data, textStatus, jqXHR) {
                    getProducts();
                    msgBoxHandle(PRODUCT_ADDED, data._id);
                },
                statusCode : { // TODO: Manage messages
                    403 : function () {
                        alert('something went wrong with addProduct');
                    },
                    412 : function () {
                        alert('some parameter is missing for addProduct');
                    }
                }
            });
        },

        deleteProduct = function (id) {
            $.ajax({
                type : 'DELETE',
                url : '/products/' + id,
                data : {
                    'id' : id
                },
                success : function (data, textStatus, jqXHR) {
                    getProducts();
                    msgBoxHandle(PRODUCT_DELETED, data.id);
                },
                statusCode : { // TODO: Manage messages
                    403 : function () {
                        alert('something went wrong');
                    },
                    412 : function () {
                        alert('some parameter is missing');
                    }
                }
            });
        },

        updateProduct = function (data) {
            $.ajax({
                type : 'PUT',
                url : '/products/' + data.id,
                data : {
                    'id' : data.id,
                    'name' : data.name,
                    'description' : data.description
                },
                success : function (data, textStatus, jqXHR) {
                    getProducts();
                    msgBoxHandle(PRODUCT_UPDATED, data.id);
                },
                statusCode : { // TODO: Manage messages
                    403 : function () {
                        alert('something went wrong');
                    },
                    412 : function () {
                        alert('some parameter is missing');
                    }
                }
            });
        },

        findProductById = function (id, forUpdate) {
            $.ajax({
                type : 'GET',
                url : '/products/' + id,
                success : function (data, textStatus, jqXHR) {
                    if (forUpdate) {
                        msgBoxHandle(PRODUCT_UPDATE_BOX, data);
                    }
                    //TBD: Show only the selected user
                },
                statusCode : { // TODO: Manage messages
                    403 : function () {
                        alert('something went wrong');
                    },
                    412 : function () {
                        alert('some parameter is missing');
                    }
                }
            });
        },

        renderProduct = function (key, val) {
            //append product item to html
            $("<li/>").html("<span>" + key +
                "</span><span><b>" + val.name + "</b>" +
                "</span><span>" + val.description +
                "</span><span> <input class='deleteBtn' id=" + val._id + " type='button' value='Delete' /> <input class='updateBtn' id=" + val._id + " type='button' value='Update' /> " +
                "</span>"
                ).appendTo('#productsList');
        };

    getProducts();

    // add product btn
    $('#btnAddProductForm').click(function () {
        msgBoxHandle(PRODUCT_ADD_BOX, null);
    });

    // refresh btn
    $('#btnRefreshProducts').click(function () {
        msgBoxHandle(PRODUCTS_REFRESH, null);
        getProducts();
    });

    // add the product to db and hide dialog box
    $('#btnProductForm').click(function () {
        var data = {};
        data.id = $('#pid').html();
        data.name = $('#productInputName').val();
        data.description = $('#productInputDesc').val();
        if (this.value === "Add") {
            addProduct(data);
        }
        if (this.value === "Update") {
            updateProduct(data);
        }
        $('#productForm').hide();
    });
});