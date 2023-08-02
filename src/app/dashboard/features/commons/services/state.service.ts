import { Injectable } from "@angular/core";

export const ROLE = {
    MANAGER: "manager",
    REVIEWER: "reviewer",
    EMITTER: "emitter",
};
export const ROLES = Object.values(ROLE);

export interface User {
    id?: number;
    firstName?: string | null;
    lastName?: string | null;
    username: string;
    password: string;
    roles: string[];
}

export enum ModelType {
    classification = 'classification',
    regression = 'regression',
}

export enum ModelNameClassifier {
    XGBoostClassified = 'XGBoostClassified',
}

export enum ModelNameRegressor {
    XGBoostReg = 'XGBoostReg',
    LLR = 'LLR',
}

export enum ModelObjectiveClassifier {
    binary_logistic = 'binary:logistic',
    multi_softmax = 'multi:softmax' ,
}

export enum ModelObjectiveRegressor {
    reg_squarederror = 'reg:squarederror',
    reg_absoluteerror = 'reg:absoluteerror',
    reg_squaredlogerror = 'reg:squaredlogerror',
}

export enum ModelPenalty {
    l1 = 'l1',
    l2 = 'l2',
    elisticnet = 'elisticnet',
    None = 'None',
}

export interface Model {
    type: ModelType;
    name: ModelNameClassifier | ModelNameRegressor;
    objective?: ModelObjectiveClassifier | ModelObjectiveRegressor | null;
    learning_rate?: number | null;
    max_depth?: number | null;
    alpha?: number | null;
    gamma?: number | null;
    penalty?: ModelPenalty | null;
    max_iter?: number | null;
    fit_intercept?: boolean | null;
}

export interface Federation {
    num_round: number,
    min_available_clients: number,
    fraction_fit: number,
    min_fit_clients: number,
    fraction_evaluate: number,
    min_evaluate_clients: number,
}

export interface Project {
    id?: number;
    name: string;
    description: string;
    model?: Model,
    federation?: Federation,
    reviewsRequired: number;
    approvalCount: number;
    participantsRequired: number;
    participants: User[];
    datapoints: number;
    status: "pending" | "accepted" | "running";
}

export interface Organization {
    id?: number;
    name: string;
    description: string;
    users: User[];
    projects: Project[];
}

@Injectable({
    providedIn: "root"
})
export class StateService {

    organizations: Organization[] = [
        {
            id: 1,
            name: "Prima prova",
            description: "La mia prima organizzazione",
            users: [
                {
                    id: 1,
                    firstName: "Tizio",
                    username: "tizio1984",
                    password: "prova",
                    roles: [ ROLE.MANAGER ]
                },
                {
                    id: 2,
                    firstName: "Caio",
                    lastName: "Rossi",
                    username: "caio_rossi_90",
                    password: "prova",
                    roles: [ ROLE.MANAGER ]
                },
                {
                    id: 3,
                    firstName: "Sempronio",
                    lastName: "Severi",
                    username: "sempronio_super_69",
                    password: "prova",
                    roles: [ ROLE.REVIEWER ]
                },
                {
                    id: 4,
                    username: "pippo",
                    password: "prova",
                    roles: [ ROLE.EMITTER ]
                }
            ],
            projects: [
                {
                    id: 1,
                    name: "Prima prova",
                    description: "Il mio primo progetto",
                    reviewsRequired: 1,
                    approvalCount: 0,
                    participantsRequired: 10,
                    participants: [ ],
                    datapoints: 0,
                    status: "pending"
                },
            ],
        },
        {
            id: 2,
            name: "Ospedale X",
            description: "Questo è il contenitore dell'Ospedale X",
            users: [
                {
                    id: 1,
                    firstName: "Tizio",
                    username: "tizio1984",
                    password: "prova",
                    roles: [ ROLE.MANAGER ]
                },
                {
                    id: 2,
                    firstName: "Caio",
                    lastName: "Rossi",
                    username: "caio_rossi_90",
                    password: "prova",
                    roles: [ ROLE.MANAGER ]
                },
                {
                    id: 3,
                    firstName: "Sempronio",
                    lastName: "Severi",
                    username: "sempronio_super_69",
                    password: "prova",
                    roles: [ ROLE.REVIEWER ]
                },
                {
                    id: 4,
                    username: "pippo",
                    password: "prova",
                    roles: [ ROLE.EMITTER ]
                }
            ],
            projects: [
                {
                    id: 2,
                    name: "Regressione patologia Y",
                    description: "Con questo progetto speriamo di poter scoprire una correlazione tra A e B",
                    reviewsRequired: 2,
                    approvalCount: 2,
                    participantsRequired: 4,
                    participants: [
                        {
                            id: 1,
                            firstName: "Tizio",
                            username: "tizio1984",
                            password: "prova",
                            roles: [ ROLE.MANAGER ]
                        },
                        {
                            id: 2,
                            firstName: "Caio",
                            lastName: "Rossi",
                            username: "caio_rossi_90",
                            password: "prova",
                            roles: [ ROLE.MANAGER ]
                        },
                        {
                            id: 3,
                            firstName: "Sempronio",
                            lastName: "Severi",
                            username: "sempronio_super_69",
                            password: "prova",
                            roles: [ ROLE.REVIEWER ]
                        },
                        {
                            id: 4,
                            username: "pippo",
                            password: "prova",
                            roles: [ ROLE.EMITTER ]
                        }
                    ],
                    datapoints: 1024,
                    status: "running"
                },
            ],
        }
    ];

    constructor() {
        this.loadFromLocalStorage();
        console.log("State", this);
    }

    saveIntoLocalStorage() {
        localStorage.setItem("organizations", JSON.stringify(this.organizations));
    }

    loadFromLocalStorage() {
        const organizations = localStorage.getItem("organizations");
        if (organizations) this.organizations = JSON.parse(organizations) as Organization[];
    }

    // Start of Organization
    getOrganizations() {
        return [ ...this.organizations ].reverse();
    }

    getOrganizationById(id: number) {
        return this.organizations.find(org => org.id == id);
    }

    insertOrganization(organization: Organization) {

        const lastOrganization = this.organizations[this.organizations.length - 1];
        const id = lastOrganization ? lastOrganization.id! + 1 : 1;
        this.organizations.push({
            ...organization,
            id
        });

        this.saveIntoLocalStorage();
    }

    updateOrganization(organizationId: number, newOrganization: Organization) {

        const oldOrganization = this.organizations.find(({ id }) => id === organizationId);
        if (oldOrganization) {

            const oldOrganizationIndex = this.organizations.findIndex(({ id }) => id === organizationId);

            this.organizations.splice(
                oldOrganizationIndex,
                1,
                {
                    ...oldOrganization,
                    ...newOrganization
                }
            );
    
            this.saveIntoLocalStorage();
        }
    }

    deleteOrganization(organizationId: number) {

        const index = this.organizations.findIndex(({ id }) => id === organizationId);
        if (index > -1) {

            this.organizations.splice(index, 1);
    
            this.saveIntoLocalStorage();
        }
    }
    // End of Organization



    // Start of Project
    getProjects(organizationId: number) {
        const projects = this.getOrganizationById(organizationId)?.projects || [];
        return [ ...projects ].reverse();
    }

    getProjectById(organizationId: number, id: number) {
        return this.getOrganizationById(organizationId)?.projects.find(p => p.id == id);
    }

    insertProject(organizationId: number, project: Project) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const lastProject = organization.projects[organization.projects.length - 1];
            const id = lastProject ? lastProject.id! + 1 : 1;
            organization.projects.push({
                ...project,
                id
            });

            this.saveIntoLocalStorage();
        }
    }

    updateProject(organizationId: number, projectId: number, newProject: Project) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const oldProject = organization.projects.find(({ id }) => id === projectId);
            if (oldProject) {

                const oldProjectIndex = organization.projects.findIndex(({ id }) => id === projectId);

                organization.projects.splice(
                    oldProjectIndex,
                    1,
                    {
                        ...oldProject,
                        ...newProject
                    }
                );
    
                this.saveIntoLocalStorage();
            }
        }
    }

    deleteProject(organizationId: number, projectId: number) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const index = organization.projects.findIndex(({ id }) => id === projectId);
            if (index > -1) {

                organization.projects.splice(index, 1);
    
                this.saveIntoLocalStorage();
            }
        }
    }
    // End of Project



    // Start of User
    getUsers(organizationId: number) {
        const users = this.getOrganizationById(organizationId)?.users || [];
        return [ ...users ].reverse();
    }

    getUserById(organizationId: number, userId: number) {
        return this.getOrganizationById(organizationId)?.users.find(({ id }) => id == userId);
    }

    insertUser(organizationId: number, user: User) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const lastUser = organization.users[organization.users.length - 1];
            const id = lastUser ? lastUser.id! + 1 : 1;
            organization.users.push({
                ...user,
                id
            });

            this.saveIntoLocalStorage();
        }
    }

    updateUser(organizationId: number, userId: number, newUser: User) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const oldUser = organization.users.find(({ id }) => id === userId);
            if (oldUser) {

                const oldUserIndex = organization.users.findIndex(({ id }) => id === userId);

                organization.users.splice(
                    oldUserIndex,
                    1,
                    {
                        ...oldUser,
                        ...newUser
                    }
                );
    
                this.saveIntoLocalStorage();
            }
        }
    }

    deleteUser(organizationId: number, userId: number) {

        const organization = this.getOrganizationById(organizationId);
        if (organization) {

            const index = organization.users.findIndex(({ id }) => id === userId);
            if (index > -1) {

                organization.users.splice(index, 1);
    
                this.saveIntoLocalStorage();
            }
        }
    }
    // End of User

}