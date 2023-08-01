import { Injectable } from "@angular/core";

export interface User {
    id: number;
    username: string;
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
        { id: 1, username: "Tizio", roles: [ "manager" ] },
        { id: 2, username: "Caio", roles: [ "co-manager" ] },
        { id: 3, username: "Sempronio", roles: [ "reviewer" ] },
        { id: 4, username: "Pippo", roles: [ "emitter" ] },
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
            participantsRequired: 3,
            participantIds: [ 1, 2, 3 ],
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
            userIds: [ 1, 2, 3 ],
            projectIds: [ 2 ],
        }
    ];

    selectOrganizationById(id: number) {
        const organization = this.organizations.find(org => org.id == id);
        if (!organization) return null;
        return {
            ...organization,
            users: organization.userIds.map(id => this.selectUserById(id)),
            projects: organization.projectIds.map(id => this.selectProjectById(id))
        };
    }

    selectUserById(id: number) {
        return this.users.find(u => u.id == id);
    }

    selectProjectById(id: number) {
        const project = this.projects.find(p => p.id == id);
        if (!project) return null;
        return {
            ...project,
            participants: project.participantIds.map(id => this.selectUserById(id)),
        };
    }

}