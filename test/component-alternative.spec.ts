import * as angular from "angular";
import "angular-mocks/ngMock";
import { renderFactory, IRender } from "ng-metadata/testing";
import { bundle, Component, getInjectableName, NgModule } from "ng-metadata/core";

describe("Alternative Component test", () => {
    let $rootScope: angular.IRootScopeService;
    let $compile: angular.ICompileService;
    let $scope: angular.IScope;
    let render: IRender<any>;

    @Component({
        selector: "sub-component",
        template: "hello ! "})
    class SubComponent {}

    @Component({
        selector: "component",
        template: "<sub-component></sub-component>",
    })
    class ParentComponent {}

    @NgModule({
        declarations: [SubComponent, ParentComponent]
    })
    class TestingModule {}

    const TestModuleMock: string = bundle(TestingModule).name;

    beforeEach(angular.mock.inject(($injector: ng.auto.IInjectorService) => {
        angular.mock.module(TestModuleMock, ($provide: any) => {
            $provide.decorator(getInjectableName(SubComponent),
                ($delegate: any) => ({
                    restrict: "EA",
                    controller: angular.noop,
                    template: "hello mock"})
            );
        });

        $compile = $injector.get<ng.ICompileService>("$compile");
        $rootScope = $injector.get<ng.IRootScopeService>("$rootScope");
        $scope = $rootScope.$new();

        render = renderFactory( $compile, $scope );
    }));

    it("Context to be an Object", () => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controler> and <the DOM element>
        expect(context).toEqual(jasmine.any(Object));
    });

    it("expects to have a controller when using inject", inject(($injector: ng.auto.IInjectorService) => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controler> and <the DOM element>
        expect(context.ctrl).toBeDefined();
    }));

    it("expects to have a controller", () => {
        let context = render(ParentComponent); // contain <current instance of ParentComponent controller> and <the DOM element>
        expect(context.ctrl).toBeDefined();
    });
});
