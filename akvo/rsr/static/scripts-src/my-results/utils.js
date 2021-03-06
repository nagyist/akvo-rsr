/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React, { PropTypes } from 'react';
import fetch from 'isomorphic-fetch';

import { onChange } from "actions/collapse-actions"
import { KEYS_RESET } from "reducers/collapseReducer"

import store from "./store"
import { MODELS_LIST, PARENT_FIELD, OBJECTS_RESULTS, API_LIMIT } from "./const"


export function identicalArrays(array1, array2) {
    // Compare two arrays and return true if they are identical, otherwise false
    try {
        return (
            (array1.length == array2.length) &&
            array1.every((element, index) => (element === array2[index]))
        )
    } catch(e) {
        return false;
    }
}


// global holding the month's translation strings
let months;
export function displayDate(dateString) {
    // Display a dateString like "25 Jan 2016"
    // read from the DOM once
    if (!months) {
        months = JSON.parse(document.getElementById('i18nMonths').innerHTML);
    }
    if (dateString) {
        const locale = "en-gb";
        const date = new Date(dateString.split(".")[0].replace("/", /-/g));
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return day + " " + month + " " + year;
    }
    return "Unknown date";
}


export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function APICall(method, url, data, callback, retries) {
    function modify(method, url, data){
        return fetch(url, {
            credentials: 'same-origin',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: JSON.stringify(data),
        })
    }

    let handler;
    switch (method) {
        case "GET":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            break;

        case "POST":
            handler = () => modify('POST', url, data);
            break;

        case "PUT":
            handler = () => modify('PUT', url, data);
            break;

        case "PATCH":
            handler = () => modify('PATCH', url, data);
            break;

        case "DELETE":
            handler = () => fetch(url, {
                credentials: 'same-origin',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie('csrftoken')
                }
            });
            break;
    }
    return handler;
    handler()
        //TODO: error handling? See https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        .then(function(response) {
            if (response.status != 204)
                return response.json();
            else
                return response;
        }).then(callback);
}


// Object holds callback URL functions as values, most of them called with an id parameter
// Usage: endpoints.result(17) -> "http://rsr.akvo.org/rest/v1/result/17/?format=json"
export const endpoints = {
        "result": (id) => `/rest/v1/result/${id}/?format=json`,
        "results": (id) => `/rest/v1/result/?format=json&limit=${API_LIMIT}&project=${id}`,
        "indicators": (id) =>
            `/rest/v1/indicator/?format=json&limit=${API_LIMIT}&result__project=${id}`,
        "periods": (id) =>
            `/rest/v1/indicator_period/?format=json&limit=${API_LIMIT}&indicator__result__project=${id}`,
        "updates": (id) =>
            `/rest/v1/indicator_period_data/?format=json&limit=${API_LIMIT}&period__indicator__result__project=${id}`,
        "comments": (id) =>
            `/rest/v1/indicator_period_data_comment/?format=json&limit=${API_LIMIT}&data__period__indicator__result__project=${id}`,
        "period": (id) => `/rest/v1/indicator_period/${id}/?format=json`,
        "update_and_comments": (id) => `/rest/v1/indicator_period_data_framework/${id}/?format=json`,
        "updates_and_comments": () =>
            `/rest/v1/indicator_period_data_framework/?format=json&limit=${API_LIMIT}`,
        "user": (id) => `/rest/v1/user/${id}/?format=json`,
        "partnerships": (id) => `/rest/v1/partnership/?format=json&limit=${API_LIMIT}&project=${id}`,
        "file_upload": (id) => `/rest/v1/indicator_period_data/${id}/upload_file/?format=json`
};


export function displayNumber(numberString) {
    // Add commas to numbers of 1000 or higher.
    if (numberString !== undefined && numberString !== null) {
        var locale = "en-gb";
        var float = parseFloat(numberString);
        if (!isNaN(float)) {
            return float.toLocaleString(locale);
        }
    }
    return '';
}


// Translation a la python. Let's hope we never need lodash...
let strings;
export function _(s) {
    // load once from the DOM
    if (!strings) {
        strings = JSON.parse(document.getElementById('translation-texts').innerHTML);
    }
    return strings[s];
}

// Newly created updates get the id 'new-<N>' where N is an int starting at 1
export const isNewUpdate = (update) => {return update.id.toString().substr(0, 4) === 'new-'};


export const findChildren = (parentId, childModel, parentField) => {
    // Filter childModel based on equality of FK field (parentField) with parent id (props.parentId)
    // Return object with array of filtered ids and array of corresponding filtered objects
    const model = store.getState().models[childModel];
    if (model && model.ids) {
        const { ids, objects } = model;
        const filteredIds = ids.filter(
            // if parentField is undefined return all ids (This applies to Result)
            id => parentField ? objects[id][parentField] === parentId : true
        );
        const filteredObjects = filteredIds.map(id => objects[id]);
        return {ids: filteredIds, [childModel]: filteredObjects}
    }
    return {ids: [], [childModel]: undefined};
};


export function idsToActiveKey(ids) {
    // Return the IDs as an array of strings, used as activeKey
    const unique = new Set(ids);
    return [...unique].map(id => id.toString());
}


export function createToggleKey(ids, activeKey) {
    // Create an activeKey array for a Collapse element with either all panels open or none
    // uses the IDs of the panels derived from the relevant model IDs
    const allOpen = (ids.length > 0) && idsToActiveKey(ids);
    // If allOpen is identical to activeKey, all panels are already open and we close them
    return identicalArrays(activeKey, allOpen) ? [] : allOpen;
}


export function collapseId(model, id) {
    // The collapseId is created from the model name and the ID of the parent object of the Collapse
    return `${model}-${id}`;
}


function childModelName(model) {
    try {
        return MODELS_LIST[MODELS_LIST.indexOf(model) + 1];
    } catch(e) {
        return undefined;
    }
}

function parentModelName(model) {
    try {
        return MODELS_LIST[MODELS_LIST.indexOf(model) - 1];
    } catch(e) {
        return undefined;
    }
}


function tree(model, parentId) {
    // Construct a tree representation of the subtree of data with object model[parentId] as root
    const ids = findChildren(parentId, model, PARENT_FIELD[model]).ids;
    const childModel = childModelName(model);
    const children = ids.map((cId) => {
        return tree(childModel, cId)
    });
    if (children.length > 0) {
        return {id: parentId, model: model, children: children}
    } else {
        return {id: parentId}
    }
}


function flatten(arr) {
    // Flatten an array of arrays
    return arr.reduce(
        (acc, val) => acc.concat(
            Array.isArray(val) ? flatten(val) : val),
            []
    );
}


function keysList(node, close) {
    // "Disassemble" the tree representation of the data from tree() and return a list of objects.
    // Each object holds the collapseID of the corresponding Collapse and its activeKey
    const key = {
        collapseId: collapseId(node.model, node.id),
        activeKey: close ? [] : idsToActiveKey(node.children.map(child => child.id.toString()))
    };
    const children = node.children.filter((child) =>
        child.model !== undefined
    );
    const childKeys = children.map((node) =>
        keysList(node, close)
    );
    return flatten([key].concat(childKeys));

}


export function toggleTree(model, id, close) {
    const fullTree = tree(model, id);
    return keysList(fullTree, close);
}


export function createToggleKeys(parentId, model, activeKey) {
    // get all child nodes
    const childIds = findChildren(
        parentId, model, PARENT_FIELD[model]).ids;
    // determine if we should open or close
    const fullyOpenKey = idsToActiveKey(childIds);
    const close = identicalArrays(fullyOpenKey, activeKey);
    // construct the array of Collapse activeKeys for the sub-tree
    return toggleTree(model, parentId, close);
}


function lineage(model, id) {
    // return the model and ID of me and my ancestors all the way up to results
    const parentModel = parentModelName(model);
    if (parentModel) {
        const storeModel = store.getState().models[model];
        if (storeModel.objects) {
            const parentId = storeModel.objects[id][PARENT_FIELD[model]];
            return [{model, id}].concat(lineage(parentModel, parentId));
        }
    }
    return [{model, id}];
}

function lineageKeys(model, id) {
    // construct collapse activeKey keys for me and all my ancestors so I will be visible
    const reversedLineage = lineage(model, id).reverse();
    let parentId = OBJECTS_RESULTS;
    return reversedLineage.reduce(
        (keys, obj) => {
            const key = keys.concat({[collapseId(obj.model, parentId)]: [obj.id]});
            parentId = obj.id;
            return key;
        },
        []
    )
}

export function openNodes(model, ids, reset) {
    // construct collapse keys that represent the open state of all nodes in ids list of type model
    // and all required parents. If the reset boolean is true then first reset the whole tree.

    // get lineages of all objects based on model and ids
    const lineages = ids.map((id) => lineageKeys(model, id));
    // flatten to get an array of objects: [{collapseId: id}, ...]
    const individualKeys = flatten(lineages);

    const mergedKeys = individualKeys.reduce(
        (keys, key) => {
            const keyName = Object.keys(key)[0];
            return Object.assign(keys, {[keyName]: (keys[keyName] || []).concat(key[keyName])});
        },
        {}
    );
    if (reset) {
        store.dispatch({type: KEYS_RESET});
    }
    Object.keys(mergedKeys).map((key) => {
        store.dispatch(onChange(key, idsToActiveKey(mergedKeys[key])));
    });
}