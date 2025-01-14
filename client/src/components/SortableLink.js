import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Col, Form, Row } from 'react-bootstrap';

const SortableLink = ({ id, link, index, handleLinkChange, deleteLinkField }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
<div ref={setNodeRef} style={{ ...style, backgroundColor: 'rgba(248, 249, 250, 0.9)' }} className="mb-3 p-3 border rounded">
            <Row className="align-items-center ">
                {/* Drag Handle (Three Dots Icon) - Visible on larger screens */}
                <Col md={1} className="d-none d-md-flex justify-content-center align-items-center">
                    <div 
                        {...attributes} 
                        {...listeners} 
                        style={{ cursor: 'grab' }}
                    >
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                </Col>

                {/* Link URL */}
                <Col xs={12} md={6}>
                    <Form.Group controlId={`formLinkUrl${index}`}>
                        <Form.Label>Link URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter link"
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            className="form-control-sm"
                        />
                    </Form.Group>
                </Col>

                {/* Link Title */}
                <Col xs={12} md={4}>
                    <Form.Group controlId={`formLinkTitle${index}`}>
                        <Form.Label>Link Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Link Title"
                            value={link.linkTitle}
                            onChange={(e) => handleLinkChange(index, 'linkTitle', e.target.value)}
                            className="form-control-sm"
                        />
                    </Form.Group>
                </Col>

                {/* Drag Handle and Delete Button - Visible on smaller screens */}
                <Col xs={12} className="d-flex d-md-none justify-content-end align-items-center gap-2 mt-3">
                    {/* Drag Handle (Three Dots Icon) */}
                    <div 
                        {...attributes} 
                        {...listeners} 
                        style={{ cursor: 'grab' }}
                    >
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>

                    {/* Delete Button */}
                    <Button
                        variant="danger"
                        onClick={() => deleteLinkField(index)}
                        className="btn-sm"
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </Col>

                {/* Delete Button - Visible on larger screens */}
                <Col md={1} className="d-none d-md-flex justify-content-center align-items-center">
                    <Button
                        variant="danger"
                        onClick={() => deleteLinkField(index)}
                        className="btn-sm rounded shadow-sm"
                    >
                        <i className="bi bi-trash"></i>
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default SortableLink;