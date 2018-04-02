import moment from 'moment';

export const enums = {
};

export const dataTypes = {
    tags: 'Input',

    modifyTime: 'DatePicker',
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
    } else if (dataTypes[key] === 'DatePicker' && values !== undefined) {
        return moment(values).format('YYYY-MM-DD HH:mm');
    } else if (key === 'tags') {
        var str = '';
        for (let i in values) {
            if (i < values.length - 1 && values[i] !== '') {
                str += values[i] + ',';
            } else {
                str += values[i];
            }
        }
        return str;
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
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};
