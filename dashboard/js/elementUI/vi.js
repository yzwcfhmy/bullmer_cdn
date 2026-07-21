(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('element/locale/vi', ['module', 'exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports);
        global.ELEMENT.lang = global.ELEMENT.lang || {};
        global.ELEMENT.lang.vi = mod.exports;
    }
})(this, function (module, exports) {
    'use strict';

    exports.__esModule = true;
    exports.default = {
        el: {
            colorpicker: {
                confirm: 'Đồng ý',
                clear: 'Xóa'
            },
            datepicker: {
                now: 'Hiện tại',
                today: 'Hôm nay',
                cancel: 'Hủy',
                clear: 'Xóa',
                confirm: 'Đồng ý',
                selectDate: 'Chọn ngày',
                selectTime: 'Chọn giờ',
                startDate: 'Ngày bắt đầu',
                startTime: 'Giờ bắt đầu',
                endDate: 'Ngày kết thúc',
                endTime: 'Giờ kết thúc',
                prevYear: 'Năm trước',
                nextYear: 'Năm sau',
                prevMonth: 'Tháng trước',
                nextMonth: 'Tháng sau',
                year: 'Năm',
                month1: 'Tháng 1',
                month2: 'Tháng 2',
                month3: 'Tháng 3',
                month4: 'Tháng 4',
                month5: 'Tháng 5',
                month6: 'Tháng 6',
                month7: 'Tháng 7',
                month8: 'Tháng 8',
                month9: 'Tháng 9',
                month10: 'Tháng 10',
                month11: 'Tháng 11',
                month12: 'Tháng 12',
                week: 'tuần',
                weeks: {
                    sun: 'CN',
                    mon: 'T2',
                    tue: 'T3',
                    wed: 'T4',
                    thu: 'T5',
                    fri: 'T6',
                    sat: 'T7'
                },
                months: {
                    jan: 'Thg1',
                    feb: 'Thg2',
                    mar: 'Thg3',
                    apr: 'Thg4',
                    may: 'Thg5',
                    jun: 'Thg6',
                    jul: 'Thg7',
                    aug: 'Thg8',
                    sep: 'Thg9',
                    oct: 'Thg10',
                    nov: 'Thg11',
                    dec: 'Thg12'
                }
            },
            select: {
                loading: 'Đang tải',
                noMatch: 'Không có dữ liệu phù hợp',
                noData: 'Không có dữ liệu',
                placeholder: 'Chọn'
            },
            cascader: {
                noMatch: 'Không có dữ liệu phù hợp',
                loading: 'Đang tải',
                placeholder: 'Chọn',
                noData: 'Không có dữ liệu'
            },
            pagination: {
                goto: 'Đến trang',
                pagesize: '/trang',
                total: 'Tổng {total}',
                pageClassifier: ''
            },
            messagebox: {
                title: 'Thông báo',
                confirm: 'Đồng ý',
                cancel: 'Hủy',
                error: 'Dữ liệu không hợp lệ'
            },
            upload: {
                deleteTip: 'Nhấn xóa để xóa',
                delete: 'Xóa',
                preview: 'Xem trước',
                continue: 'Tiếp tục'
            },
            table: {
                emptyText: 'Không có dữ liệu',
                confirmFilter: 'Xác nhận',
                resetFilter: 'Đặt lại',
                clearFilter: 'Tất cả',
                sumText: 'Tổng'
            },
            tree: {
                emptyText: 'Không có dữ liệu'
            },
            transfer: {
                noMatch: 'Không có dữ liệu phù hợp',
                noData: 'Không có dữ liệu',
                titles: ['Danh sách 1', 'Danh sách 2'],
                filterPlaceholder: 'Nhập từ khóa',
                noCheckedFormat: '{total} mục',
                hasCheckedFormat: '{checked}/{total} đã chọn'
            },
            image: {
                error: 'THẤT BẠI'
            },
            pageHeader: {
                title: 'Quay lại'
            },
            popconfirm: {
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            },
            empty: {
                description: 'Không có dữ liệu'
            }
        }
    };
    module.exports = exports['default'];
});