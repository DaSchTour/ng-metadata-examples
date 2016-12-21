import * as angular from "angular";
import "angular-mocks/ngMock";
import { renderFactory, IRender } from "ng-metadata/testing";
import { bundle, Component, NgModule, Injectable, OnInit, Inject } from "ng-metadata/core";

/**
 * Test Test for ng-metadata
 */

describe("Component and Service test", () => {
    let $rootScope: angular.IRootScopeService;
    let $compile: angular.ICompileService;
    let $scope: angular.IScope;
    let render: IRender<any>;

    @Injectable()
    class DummyService {
        constructor() {
            console.log("init dummy service");
        }
        public hello() {
            return "Hello From Service!";
        }
    }

    @Component({
        selector: "sub-component",
        template: "hello ! "})
    class SubComponent {}

    @Component({
        selector: "component",
        template: "<sub-component></sub-component><div>{{$ctrl.label}}</div>",
    })
    class ParentComponent implements OnInit {
        public label: string;
        private service: DummyService;
        constructor(@Inject(DummyService) service: DummyService) {
            console.log(service);
            this.service = service;
        }
        public ngOnInit() {
            this.label = this.service.hello();
        }
    }

    @NgModule({
        declarations: [SubComponent, ParentComponent],
        providers: [DummyService]
    })
    class TestingModule {
        constructor() {
            console.log("module init");
        }
    }

    const testModuleMock: string = bundle(TestingModule).name;

    beforeAll(() => {
        angular.mock.module(testModuleMock);
    });

    beforeEach(angular.mock.inject(($injector: ng.auto.IInjectorService) => {
        $compile = $injector.get<ng.ICompileService>("$compile");
        $rootScope = $injector.get<ng.IRootScopeService>("$rootScope");
        // $injector.get<DummyService>(getInjectableName(DummyService));
        $scope = $rootScope.$new();
        console.log($scope);
        render = renderFactory( $compile, $scope );
    }));

    it("expects angular to be defined", () => {
        console.log(angular);
        expect(angular).toBeDefined();
    });

    it("expects ParentComponent to be defined", () => {
        expect(ParentComponent).toBeDefined();
    });

    it("expects DummyService to be defined", () => {
        expect(DummyService).toBeDefined();
    });

    it("expects render to be defined", () => {
        expect(render).toBeDefined();
    });

    it("Context to be an Object", () => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controller> and <the DOM element>
        expect(context).toEqual(jasmine.any(Object));
    });

    it("expects to have a controller when using inject", inject(($injector: ng.auto.IInjectorService) => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controller> and <the DOM element>
        expect(context.ctrl).toBeDefined();
    }));

    it("expects to have a controller", () => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controller> and <the DOM element>
        expect(context.ctrl).toBeDefined();
    });
});
