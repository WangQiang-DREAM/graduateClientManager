import moment from 'moment';

export const enums = {
    roomStatus: [
        { label: '可入住', value: '0' },
        { label: '已住满', value: '1' },
    ],
    status: [
        { label: '在线', value: '0' },
        { label: '已下线', value: '1' },
    ]
};

export const dataTypes = {


    createTime: 'DatePicker',


};

export const formatViewData = (key, values) => {
    if (enums[key]) {
        let result = [];
        if (typeof values === 'string') {
            values = values.split(',');
        } else if (typeof values === 'number' || typeof values === 'boolean') {
            values = [values];
        }
        for (let value of values) {
            for (let item of enums[key]) {
                if (item.value === value) {
                    result.push(item.label);
                }
            }
        }
        return result.join(',');
    } else if (dataTypes[key] === 'DatePicker') {
        return moment(values).format('YYYY-MM-DD hh:mm');
    } else {
        return values;
    }
};

export const formatFormData = values => {
    let result = {};
    Object.keys(values).forEach(key => {
        if (typeof values[key] !== 'undefined') {
            if (values[key] instanceof moment) {
                result[key] = values[key].valueOf();
            } else {
                result[key] = values[key];
            }
        }
    });
    return result;
};

export const formItemLayout = {
    labelCol: { span: 8, offset: 2 },
    wrapperCol: { span: 14 },
};
