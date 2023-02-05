import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";

import "./VueComponentPreview.scss";

const VUE_UPDATE_DELAY = 1700;

export interface VueComponentPreviewProps {
    template: string;
    componentName: string;
    componentCode: string;
}

let compilerErrors: string[] = [];

function clearErrorList() {
    compilerErrors = [];
}

function appendError(message: string) {
    compilerErrors.push(message);
}

function buildErrorHTML() {
    let errorTemplate = `<ul class="VueComponentPreview-ErrorList">`;

    for(let err of compilerErrors) {
        let htmlError = `<li class="VueComponentPreview-Error">${err}</li>`;
        errorTemplate += htmlError;
    }

    errorTemplate += "</ul>";
    return errorTemplate;
}

const generateRandomId = () => {
    return "id" + Math.random().toString(36).slice(2)
}

const compileVueComponent = (wrapperId: string, template: string, componentName: string, componentCode: string) => {

    clearErrorList();

    const container = document.getElementById(wrapperId)?.parentElement;
    if(container === null || container === undefined)
        return;
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("VueComponentPreview-ErrorView");
    errorContainer.style.display = "none";
    container.appendChild(errorContainer);

    
    global.httpVueLoader.httpRequest = (url: string) => {
        return new Promise<string>((resolve, reject) => {
            resolve(componentCode);
        });
    }

    global.Vue.config.errorHandler = function(err, vm, info) {
        console.dir(err);
        // appendError(err.message);
        // console.dir(buildErrorHTML());
        // container.innerHTML = buildErrorHTML();
    }

    global.Vue.config.warnHandler  = function(err, vm, info) {
        appendError(err);
        errorContainer.innerHTML = buildErrorHTML();
        errorContainer.style.display = "block";
    }

    new global.Vue({
        el: "#" + wrapperId,
        template: template,
        components: {
            [componentName]: global.httpVueLoader("#")
        }
    });
}

function setDirtyFlag(container: HTMLElement) {
    container.classList.add("VueComponentPreview-IsDirty")
}

function removeDirtyFlag(container: HTMLElement) {
    container.classList.remove("VueComponentPreview-IsDirty")
}

function updateVuePreview(container: HTMLElement, template: string, componentName: string, componentCode: string) {

    container.innerHTML = "";
    const dom = document.createElement("div");
    const wrapperId = generateRandomId();
    dom.id = wrapperId;
    container.appendChild(dom);

    compileVueComponent(wrapperId, template, componentName, componentCode);
    removeDirtyFlag(container);
}

const debouncedUpdateViewPreview = _.debounce((container: HTMLElement, template: string, componentName: string, componentCode: string) => {
    updateVuePreview(container, template, componentName, componentCode);
}, VUE_UPDATE_DELAY, {leading: true, trailing: true});

const VueComponentPreview = (props: VueComponentPreviewProps) => {

    const refPreview = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(refPreview.current === null)
            return;
        setDirtyFlag(refPreview.current);
        debouncedUpdateViewPreview(refPreview.current, props.template, props.componentName, props.componentCode);
    }, [props.template, props.componentCode, props.componentName])

    return (
        <div className="VueComponentPreview" >
            <div className="VueComponentPreview-Content" ref={refPreview} >

            </div>
        </div>
    )

}

export default VueComponentPreview;
