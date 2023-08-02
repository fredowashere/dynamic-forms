import { Injectable } from "@angular/core";

export const ROLE = {
    MANAGER: "manager",
    CO_MANAGER: "co-manager",
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

export interface Project {
    id: number;
    name: string;
    description: string;
    reviewsRequired: number;
    approvalCount: number;
    participantsRequired: number;
    participantIds: number[];
    datapoints: number;
    status: "pending" | "accepted" | "running";
}

export interface Organization {
    id: number;
    name: string;
    description: string;
    userIds: number[];
    projectIds: number[];
}

@Injectable({
    providedIn: "root"
})
export class StateService {

    selectedOrganizationId = 1;

    users: User[] = [
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
            roles: [ ROLE.CO_MANAGER ]
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
        },
    ];

    projects: Project[] = [
        {
            id: 1,
            name: "Prima prova",
            description: "Il mio primo progetto",
            reviewsRequired: 1,
            approvalCount: 0,
            participantsRequired: 10,
            participantIds: [ 4 ],
            datapoints: 0,
            status: "pending"
        },
        {
            id: 2,
            name: "Regressione patologia Y",
            description: "Con questo progetto speriamo di poter scoprire una correlazione tra A e B",
            reviewsRequired: 2,
            approvalCount: 2,
            participantsRequired: 4,
            participantIds: [ 1, 2, 3, 4 ],
            datapoints: 1024,
            status: "running"
        },
    ];

    organizations: Organization[] = [
        {
            id: 1,
            name: "Prima prova",
            description: "La mia prima organizzazione",
            userIds: [ 1, 2, 3 ],
            projectIds: [ 1 ],
        },
        {
            id: 2,
            name: "Ospedale X",
            description: "Questo è il contenitore dell'Ospedale X",
            userIds: [ 1, 2, 3, 4 ],
            projectIds: [ 2 ],
        }
    ];

    constructor() {
        this.loadFromLocalStorage();
        console.log("State", this);
    }

    saveIntoLocalStorage() {
        localStorage.setItem("users", JSON.stringify(this.users));
        localStorage.setItem("projects", JSON.stringify(this.projects));
        localStorage.setItem("organizations", JSON.stringify(this.organizations));
    }

    loadFromLocalStorage() {

        const users = localStorage.getItem("users");
        if (users) this.users = JSON.parse(users) as User[];

        const projects = localStorage.getItem("projects");
        if (projects) this.projects = JSON.parse(projects) as Project[];

        const organizations = localStorage.getItem("organizations");
        if (organizations) this.organizations = JSON.parse(organizations) as Organization[];
    }

    selectOrganizationById(id: number) {
        const organization = this.organizations.find(org => org.id == id);
        if (!organization) return null;
        return {
            ...organization,
            users: organization.userIds.map(id => this.selectUserById(id)),
            projects: organization.projectIds.map(id => this.selectProjectById(id))
        };
    }

    selectProjectById(id: number) {
        const project = this.projects.find(p => p.id == id);
        if (!project) return null;
        return {
            ...project,
            participants: project.participantIds.map(id => this.selectUserById(id)),
        };
    }

    // Start of User
    selectUserById(id: number) {
        return this.users.find(u => u.id == id);
    }

    insertUser(user: User, organizationId?: number) {

        const id = this.users[this.users.length - 1].id! + 1;

        this.users.unshift({
            ...user,
            id,
        });

        if (organizationId) {
            const organization = this.organizations.find(o => o.id === organizationId);
            if (organization) {
                organization.userIds.unshift(id);
            }
        }

        this.saveIntoLocalStorage();
    }

    updateUser(id: number, newUser: User) {

        const oldUser = this.users.find(u => u.id === id);
        const oldUserIndex = this.users.findIndex(u => u.id === id);
        this.users.splice(oldUserIndex, 1, {
            ...oldUser,
            ...newUser,
        });

        this.saveIntoLocalStorage();
    }

    deleteUser(id: number) {

        const index = this.users.findIndex(u => u.id === id);
        this.users.splice(index, 1);

        this.saveIntoLocalStorage();
    }
    // End of User

}